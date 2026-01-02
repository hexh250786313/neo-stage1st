import { zhCN } from './locales';

export default defineAppConfig({
    pages: ['pages/tab/index'],
    window: {
        backgroundTextStyle: 'light',
        // 无法使用 css 变量，会报错，只能先注释
        // navigationBarBackgroundColor: getCssVariable('color-brand-primary'),
        navigationBarBackgroundColor: '#cc9',
        navigationBarTitleText: zhCN.common.brand,
        navigationBarTextStyle: 'black',
    },
    // 小程序有包大小限制，每个包不能超过 2MB
    subpackages: [
        {
            root: 'subpackages1',
            pages: ['login/index'],
            // 不能使用这个独立分包，否则 taro 报错 Page "subpackages1/login/index" has not been registered yet.
            // 独立分包的作用是可以让这个包打包的时候打入必要的运行资源，让他可以自行访问，而不需要访问主包
            // independent: true,
        },
    ],
});
