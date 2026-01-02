# neo-stage1st

默认固定版本：
@babel/plugin-transform-class-properties
taro 相关的
webpack
其中手动固定一个 eslint，因为 8.57.0 是 8 版本最后一个版本，后续不在维护

eslint 和 webpack 是固定版本，所以，其相关的依赖只需要更新到小版本最新即可
@types/webpack-env
@pmmmwh/react-refresh-webpack-plugin
tsconfig-paths-webpack-plugin
eslint-plugin-react
eslint-plugin-react-hooks

然后如果要更新 taro 依赖版本，先用 taro init neo 初始化一套默认 react+typescript+github源默认模板，看看 taro 的版本有没有更新 eslint 和 webpack 等
