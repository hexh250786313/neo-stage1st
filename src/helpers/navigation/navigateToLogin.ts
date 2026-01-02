import Routes from '@/constants/routes';
import Taro from '@tarojs/taro';
import { useEffect } from 'react';
// 微信有个 bug，当重复触发跳转到同一个页面的时候会出现报错
// 导致跳转失败
// 所以这里增加一个锁定机制
// 只有当离开了页面之后才允许再次跳转
export const navigationLock = {
    isLocked: false,
};
export const useLoginNavigationLock = () => {
    useEffect(() => {
        navigationLock.isLocked = true;
        console.log('登录页跳转锁定');
        return () => {
            console.log('取消登录页锁定');
            navigationLock.isLocked = false;
        };
    }, []);
};
export const navigateToLogin = () => {
    if (navigationLock.isLocked) {
        console.log('登录页跳转锁定，无法跳转');
        return;
    }
    navigationLock.isLocked = true;
    console.log('登录页跳转锁定');

    Taro.navigateTo({
        url: Routes.Login,
    });
};
