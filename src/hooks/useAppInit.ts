import { appInitedAtom } from '@/atoms/appInit';
import Routes from '@/constants/routes';
import { isPathEqual } from '@/utils';
import Taro from '@tarojs/taro';
import { useAtom } from 'jotai';
import { useLayoutEffect } from 'react';

// 保证 app 初始化的时候以 Routes.tab 作为初始页面
const useAppInit = () => {
    const [appInited, setPageInited] = useAtom(appInitedAtom);

    useLayoutEffect(() => {
        if (appInited) return;
        const env = Taro.getEnv();
        const currentPage = Taro.getCurrentInstance().router?.path;
        if (isPathEqual(currentPage, Routes.Tab)) {
            setPageInited(true);
        } else {
            if (env === 'WEB') {
                window.location.href = window.location.origin;
            } else if (env === 'WEAPP') {
                Taro.reLaunch({ url: Routes.Tab });
            }
        }
    }, [setPageInited, appInited]);

    return null;
};

export default useAppInit;
