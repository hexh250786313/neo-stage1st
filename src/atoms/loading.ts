import Taro from '@tarojs/taro';
import { atom } from 'jotai';
import { store } from '.';

export const loadingCountAtom = atom(0);
export const loadingAtom = atom((get) => get(loadingCountAtom) > 0);

// 存储每个loading请求的时间戳
const loadingTimestamps = new Set<number>();
const GRACE_PERIOD = 50; // 额外延长的时间（毫秒）

export const loadingAtomWithCount = atom(
    (get) => get(loadingAtom),
    (get, set, isLoading: boolean) => {
        if (isLoading) {
            const timestamp = Date.now();
            loadingTimestamps.add(timestamp);
            set(loadingCountAtom, get(loadingCountAtom) + 1);
        } else {
            const timestamp = Array.from(loadingTimestamps)[0]; // 获取最早的时间戳
            if (timestamp) {
                loadingTimestamps.delete(timestamp);
                // 延迟减少loading计数
                setTimeout(() => {
                    set(loadingCountAtom, (currentCount) => Math.max(0, currentCount - 1));
                }, GRACE_PERIOD);
            }
        }
    },
);

export const loading: {
    show: () => void;
    hide: () => void;
} = {} as any;

const env = Taro.getEnv();

if (env === 'WEAPP' || env === 'WEB') {
    loading.show = () => {
        store.set(loadingAtomWithCount, true);
    };
    loading.hide = () => {
        store.set(loadingAtomWithCount, false);
    };
}
