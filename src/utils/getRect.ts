import Taro from '@tarojs/taro';

interface Rect {
    top: number;
    left: number;
    right: number;
    bottom: number;
}

export const getRect = (selector: string): Promise<Rect> => {
    return new Promise((resolve) => {
        return Taro.createSelectorQuery()
            .select(selector)
            .boundingClientRect()
            .exec((rect) => {
                resolve(rect[0]);
            });
    });
};
