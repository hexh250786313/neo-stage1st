import { NavigationTracker } from '@/services/navigation';
import { isPathEqual } from '@/utils';
import { useDidShow } from '@tarojs/taro';
import { useRef } from 'react';

/**
 * 检测页面返回操作的Hook
 * @param callback 当页面通过返回操作显示时触发的回调，参数为来源页面路径
 * @param path 可选参数，指定特定的来源页面路径，如果不传则匹配所有返回操作
 */
function usePageReturn(callback: (fromPath: string) => void, matchPath?: string) {
    const callbackRef = useRef(callback);
    const matchPathRef = useRef(matchPath);

    useDidShow(() => {
        setTimeout(() => {
            const tracker = NavigationTracker.getInstance();
            // 检查是否是返回操作
            const [isReturn, fromPath] = tracker.checkReturn();
            if ((isReturn && typeof matchPathRef.current !== 'string') || isPathEqual(fromPath, matchPathRef.current)) {
                callbackRef.current?.(fromPath);
            }
        });
    });
}

export default usePageReturn;
