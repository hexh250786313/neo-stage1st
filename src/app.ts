import { useLaunch } from '@tarojs/taro';
import { PropsWithChildren } from 'react';
import './app.scss';
// 引入图标样式文件
// fa 的基础样式
import './assets/iconfont/base.css';
// 需要用到的图标样式
import './assets/iconfont/icons.css';

function App({ children }: PropsWithChildren<any>) {
    useLaunch(() => {
        console.log('App launched.');
    });

    // children 是将要会渲染的页面
    return children;
}

export default App;
