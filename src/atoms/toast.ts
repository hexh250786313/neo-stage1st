import Taro from '@tarojs/taro';
import { atom } from 'jotai';
import { store } from '.';

// 定义 Toast 对象类型
export interface ToastItem {
    id: string; // 唯一标识
    message: string; // 提示消息
    createdAt: number; // 创建时间
    duration: number; // 显示时长(毫秒)
    visible: boolean; // 当前是否可见
    died: boolean; // 是否已被移除
}

// 存储所有活跃的 toast
export const toastQueueAtom = atom<ToastItem[]>([]);

// 当前 toast 是否可见
export const toastVisibleAtom = atom<boolean>((get) => {
    const toasts = get(toastQueueAtom);
    return toasts.some((toast) => toast.visible && !toast.died) || false;
});

// 默认 toast 显示时长
const DEFAULT_TOAST_DURATION = 3000;

// CSS过渡动画时间
const TRANSITION_DURATION = 300;

// 添加 toast 并管理显示/隐藏的写入器atom
export const toastAtomWithAutoHide = atom(
    (get) => get(toastQueueAtom),
    (_get, set, message: string | false, durationMs?: number) => {
        if (message === false) {
            set(toastQueueAtom, (prev) => {
                return prev.map((toast) => ({ ...toast, died: true }));
            });
            return;
        }

        // 创建新的toast对象
        const newToast: ToastItem = {
            id: Math.random().toString(36).substring(2, 15), // 使用随机字符串作为ID
            message: message,
            createdAt: Date.now(),
            duration: durationMs || DEFAULT_TOAST_DURATION,
            visible: true,
            died: false,
        };

        // 将新toast添加到队列
        set(toastQueueAtom, (prev) => [...prev, newToast]);

        // 设置定时器来隐藏toast
        setTimeout(() => {
            set(toastQueueAtom, (prev) => {
                // 找到这个toast并将visible设为false
                return prev.map((toast) => (toast.id === newToast.id ? { ...toast, visible: false } : toast));
            });

            // 等待过渡动画完成后移除toast
            setTimeout(() => {
                set(toastQueueAtom, (prev) => {
                    // 移除这个toast
                    const newQueue = prev.filter((toast) => toast.id !== newToast.id);

                    // 如果还有其他toast，将最新的设为可见
                    if (newQueue.length > 0) {
                        return newQueue.map((toast, index) =>
                            index === newQueue.length - 1 ? { ...toast, visible: true } : toast,
                        );
                    }
                    return newQueue;
                });
            }, TRANSITION_DURATION);
        }, newToast.duration);
    },
);

export const toast: {
    show: (message: string, durationMs?: number | undefined) => void;
    hide: () => void;
} = {} as any;

const env = Taro.getEnv();

if (env === 'WEAPP' || env === 'WEB') {
    toast.show = (message: string, durationMs?: number | undefined) => {
        store.set(toastAtomWithAutoHide, message, durationMs);
    };
    toast.hide = () => {
        store.set(toastAtomWithAutoHide, false);
    };
}
