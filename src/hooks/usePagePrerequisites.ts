// 检查页面先决条件是否满足，如果不满足就返回
import { isInited } from '@/utils';
import Taro from '@tarojs/taro';
import { useEffect, useRef, useState } from 'react';

/**
 * 检查页面先决条件是否满足的Hook
 * @param data 需要检查的数据数组
 * @returns 数据是否满足前置条件
 */
const usePagePrerequisites = (...data: any[]): boolean => {
    const [isReady, setIsReady] = useState(false);
    const checkTimerRef = useRef<number | null>(null);
    const navigateTimerRef = useRef<number | null>(null);
    const inited = useRef<boolean>(false);

    useEffect(() => {
        if (inited.current) {
            return;
        }
        if (checkTimerRef.current) {
            clearTimeout(checkTimerRef.current);
        }

        // 将检查逻辑放在 setTimeout 中，确保数据加载完成
        checkTimerRef.current = window.setTimeout(() => {
            const checkResult = data.every((it) => isInited(it));
            setIsReady(checkResult);
            inited.current = true;
            if (!checkResult) {
                if (navigateTimerRef.current) {
                    clearTimeout(navigateTimerRef.current);
                }
                navigateTimerRef.current = window.setTimeout(() => {
                    Taro.navigateBack();
                }, 500);
            }
        }, 0);

        return () => {
            if (checkTimerRef.current) {
                clearTimeout(checkTimerRef.current);
            }

            if (navigateTimerRef.current) {
                clearTimeout(navigateTimerRef.current);
            }
        };
    }, [...data]);

    return isReady;
};

export default usePagePrerequisites;
