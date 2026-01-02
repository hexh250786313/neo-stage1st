import Taro from '@tarojs/taro';

export const setAuthToken = (params: { saltkey: string; auth: string; uid: string }) => {
    const { auth, saltkey, uid } = params;
    Taro.setStorageSync('saltkey', saltkey);
    Taro.setStorageSync('auth', auth);
    Taro.setStorageSync('uid', uid);
};
