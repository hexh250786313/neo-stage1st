import type { UserConfigExport } from '@tarojs/cli';

export default {
    logger: {
        quiet: false,
        stats: true,
    },
    mini: {},
    h5: {},
    plugins: [
        [
            'taro-plugin-sync-in-wsl',
            {
                weapp: [
                    {
                        sourcePath: 'dist',
                        // outputPath: "/mnt/c/Users/25078/Desktop/app/yingchi",
                        outputPath: '172.23.48.1::dev/neo',
                    },
                    {
                        sourcePath: 'project.config.json',
                        outputPath: '172.23.48.1::dev/neo',
                        // outputPath: "/mnt/c/Users/25078/Desktop/app/yingchi",
                    },
                    // {
                    //   sourcePath: 'cloud',
                    //   outputPath: '/mnt/c/Users/25078/Desktop/app/cloud',
                    // },
                ],
            },
        ],
    ],
} satisfies UserConfigExport<'webpack5'>;
