import Taro from '@tarojs/taro';

export const hasValidAuthToken = () => {
    const auth = Taro.getStorageSync('auth');
    const saltkey = Taro.getStorageSync('saltkey');
    const uid = Taro.getStorageSync('uid');
    return {
        auth,
        saltkey,
        uid,
        isTokenValid: !!auth && !!saltkey && !!uid,
    };
};
