import { NavigationTracker } from '@/services/navigation';
import { isPathEqual } from '@/utils';
import { useEffect, useRef } from 'react';

/**
 * 检测页面前进操作的Hook
 * @param callback 当页面通过前进操作显示时触发的回调，参数为来源页面路径
 * @param path 可选参数，指定特定的来源页面路径，如果不传则匹配所有返回操作
 */
const usePageForward = (callback: (fromPath: string) => void, matchPath?: string) => {
    const callbackRef = useRef(callback);
    const matchPathRef = useRef(matchPath);

    useEffect(() => {
        const tracker = NavigationTracker.getInstance();

        // 检查是否是前进操作
        const [isForward, fromPath] = tracker.checkForward();

        if ((isForward && typeof matchPathRef.current !== 'string') || isPathEqual(fromPath, matchPathRef.current)) {
            callbackRef.current?.(fromPath);
        }
    }, []);
};

export default usePageForward;
