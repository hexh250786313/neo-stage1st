import Taro from '@tarojs/taro';

const env = Taro.getEnv();

// 转换 px 为 rem 单位的函数
export const px = (pixel: number) => {
    if (env === 'WEAPP') {
        return Taro.pxTransform(pixel);
    }
    return `${pixel / 20}rem`;
};
