import { defineConfig, type UserConfigExport } from '@tarojs/cli';
import path from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import devConfig from './dev';
import prodConfig from './prod';

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
// export default defineConfig<'webpack5'>(async (merge, { command, mode }) => {
export default defineConfig<'webpack5'>(async (merge) => {
    const baseConfig: UserConfigExport<'webpack5'> = {
        projectName: 'neo-stage1st',
        date: '2025-10-2',
        designWidth: 375,
        deviceRatio: {
            640: 2.34 / 2,
            750: 1,
            375: 2,
            828: 1.81 / 2,
        },
        sourceRoot: 'src',
        outputRoot: 'dist',
        plugins: [
            '@tarojs/plugin-generator',
            path.resolve(__dirname, './plugins/generate-variables'),
            '@tarojs/plugin-http',
        ],
        defineConstants: {},
        copy: {
            patterns: [],
            options: {},
        },
        framework: 'react',
        compiler: 'webpack5',
        cache: {
            enable: false, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
        },
        sass: {
            data: `@use "@/styles/_index.scss" as *;`,
        },
        mini: {
            postcss: {
                pxtransform: {
                    enable: true,
                    config: {},
                },
                cssModules: {
                    enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
                    config: {
                        namingPattern: 'module', // 转换模式，取值为 global/module
                        generateScopedName: '[folder]__[local]___[hash:base64:5]',
                    },
                },
            },
            webpackChain(chain) {
                chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin);
            },
        },
        h5: {
            // 对于 @taro/components 等 taro 官方组件默认过滤，所以没有用，需要在下方 webpackChain 中改写 postcss 的 exclude 规则
            // ref: https://github.com/NervJS/taro/blob/4e186a349f95b7ec7a192727a74b9d3f5efd1924/packages/taro-vite-runner/src/postcss/postcss.h5.ts
            // esnextModules: ['taro-ui'],
            publicPath: '/',
            staticDirectory: 'static',
            output: {
                filename: 'js/[name].[hash:8].js',
                chunkFilename: 'js/[name].[chunkhash:8].js',
            },
            miniCssExtractPluginOption: {
                ignoreOrder: true,
                filename: 'css/[name].[hash].css',
                chunkFilename: 'css/[name].[chunkhash].css',
            },
            postcss: {
                autoprefixer: {
                    enable: true,
                    config: {},
                },
                cssModules: {
                    enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
                    config: {
                        namingPattern: 'module', // 转换模式，取值为 global/module
                        generateScopedName: '[folder]__[local]___[hash:base64:5]',
                    },
                },
            },
            webpackChain(chain) {
                chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin);

                // 修改 postcss 规则，让它也处理 Taro 组件
                chain.module
                    .rule('postcss')
                    .exclude.clear() // 清除默认的 exclude
                    .add((filename: string) => {
                        // 不再排除 Taro 组件，只排除其他 node_modules
                        const isTaroModule =
                            /@tarojs[/\\]components/.test(filename) || /\btaro-components\b/.test(filename);
                        if (isTaroModule) {
                            return false; // 不排除，需要处理
                        }
                        return filename.includes('node_modules'); // 排除其他 node_modules
                    })
                    .end();
            },
        },
        rn: {
            appName: 'taroDemo',
            postcss: {
                cssModules: {
                    enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
                },
            },
        },
    };

    if (process.env.NODE_ENV === 'development') {
        // 本地开发构建配置（不混淆压缩）
        return merge({}, baseConfig, devConfig);
    }
    // 生产构建配置（默认开启压缩混淆等）
    return merge({}, baseConfig, prodConfig);
});
