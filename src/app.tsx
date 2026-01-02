import { useLaunch } from '@tarojs/taro';
import { Provider } from 'jotai';
import { PropsWithChildren } from 'react';
import './app.scss';
import { store } from './atoms';
// 引入图标样式文件
// fa 的基础样式
import './assets/iconfont/base.css';
// 需要用到的图标样式
import './assets/iconfont/icons.css';

// 这个页面似乎不能导出任何其他变量，所以尽可能把需要初始化的变量都放到其他文件中去，例如 store

function App({ children }: PropsWithChildren<any>) {
    useLaunch(() => {
        console.log('App launched.');
    });

    // children 是将要会渲染的页面
    return <Provider store={store}>{children}</Provider>;
}

export default App;
