import Taro from '@tarojs/taro';
import { atom } from 'jotai';
import { store } from '.';

// 定义错误对象类型
export interface ErrorItem {
    id: string; // 唯一标识
    message: string; // 错误消息
    createdAt: number; // 创建时间
    duration: number; // 显示时长(毫秒)
    visible: boolean; // 当前是否可见
    died: boolean; // 是否已被移除
}

// 存储所有活跃的错误
export const errorQueueAtom = atom<ErrorItem[]>([]);

// 当前错误是否可见
export const errorVisibleAtom = atom<boolean>((get) => {
    const errors = get(errorQueueAtom);
    return errors.some((error) => error.visible && !error.died) || false;
});

// 默认错误显示时长
const DEFAULT_ERROR_DURATION = 3000;
// CSS过渡动画时间
const TRANSITION_DURATION = 300;

// 添加错误并管理显示/隐藏的写入器atom
export const errorAtomWithAutoHide = atom(
    (get) => get(errorQueueAtom),
    (_get, set, errorOrMessage: Error | string | false, durationMs?: number) => {
        if (errorOrMessage === false) {
            set(errorQueueAtom, (prev) => {
                return prev.map((err) => ({ ...err, died: true }));
            });

            return;
        }

        // 创建新的错误对象
        const newError: ErrorItem = {
            id: Math.random().toString(36).substring(2, 15), // 使用随机字符串作为ID
            message: typeof errorOrMessage === 'string' ? errorOrMessage : errorOrMessage.message || '发生错误',
            createdAt: Date.now(),
            duration: durationMs || DEFAULT_ERROR_DURATION,
            visible: true,
            died: false,
        };

        // 将新错误添加到队列
        set(errorQueueAtom, (prev) => [...prev, newError]);

        // 设置定时器来隐藏错误
        setTimeout(() => {
            set(errorQueueAtom, (prev) => {
                // 找到这个错误并将visible设为false
                return prev.map((err) => (err.id === newError.id ? { ...err, visible: false } : err));
            });

            // 等待过渡动画完成后移除错误
            setTimeout(() => {
                set(errorQueueAtom, (prev) => {
                    // 移除这个错误
                    const newQueue = prev.filter((err) => err.id !== newError.id);

                    // 如果还有其他错误，将最新的设为可见
                    if (newQueue.length > 0) {
                        return newQueue.map((err, index) =>
                            index === newQueue.length - 1 ? { ...err, visible: true } : err,
                        );
                    }

                    return newQueue;
                });
            }, TRANSITION_DURATION);
        }, newError.duration);
    },
);

export const error: {
    show: (errorOrMessage: string | Error, durationMs?: number | undefined) => void;
    hide: () => void;
} = {} as any;

const env = Taro.getEnv();

if (env === 'WEAPP' || env === 'WEB') {
    error.show = (errorOrMessage: string | Error, durationMs?: number | undefined) => {
        store.set(errorAtomWithAutoHide, errorOrMessage, durationMs);
    };

    error.hide = () => {
        store.set(errorAtomWithAutoHide, false);
    };
}
