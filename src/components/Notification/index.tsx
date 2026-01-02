import { error, errorAtomWithAutoHide } from '@/atoms/error';
import { loading, loadingAtomWithCount } from '@/atoms/loading';
import { toast, toastAtomWithAutoHide } from '@/atoms/toast';
import Taro from '@tarojs/taro';
import { useAtom } from 'jotai';
import { useLayoutEffect, useRef } from 'react';
import Error from './components/Error';
import Loading from './components/Loading';
import Toast from './components/Toast';

export const initRequestState = (
    params: {
        showError?: (error: Error | string | false, durationMs?: number) => void;
        hideError?: () => void;
        showToast?: (message: string, durationMs?: number) => void;
        hideToast?: () => void;
        showLoading?: () => void;
        hideLoading?: () => void;
    } = {},
) => {
    const { showError, hideError, showToast, hideToast, showLoading, hideLoading } = params;
    if (showError && error.show !== showError) {
        error.show = showError;
    }
    if (hideError && error.hide !== hideError) {
        error.hide = hideError;
    }
    if (showToast && toast.show !== showToast) {
        toast.show = showToast;
    }
    if (hideToast && toast.hide !== hideToast) {
        toast.hide = hideToast;
    }
    if (showLoading && loading.show !== showLoading) {
        loading.show = showLoading;
    }
    if (hideLoading && loading.hide !== hideLoading) {
        loading.hide = hideLoading;
    }
};
export default function StateContainer() {
    const [, setLoading] = useAtom(loadingAtomWithCount);
    const [, setError] = useAtom(errorAtomWithAutoHide);
    const [, setToast] = useAtom(toastAtomWithAutoHide);
    const initedRef = useRef(false);
    useLayoutEffect(() => {
        const env = Taro.getEnv();
        // 这种方式可以在特殊的运行环境中初始化 jotai 的 setter
        // 但是 WEB 和 WEAPP 似乎不需要
        // @ts-expect-error: xxx
        if (!initedRef.current && env === 'HEXXXXXXH') {
            const showError = (errorOrMessage: string | Error | false, durationMs?: number | undefined) => {
                setError(errorOrMessage, durationMs);
            };
            const hideError = () => {
                setError(false);
            };
            const showToast = (message: string, durationMs?: number | undefined) => {
                setToast(message, durationMs);
            };
            const hideToast = () => {
                setToast(false);
            };
            const showLoading = () => {
                setLoading(true);
            };
            const hideLoading = () => {
                setLoading(false);
            };
            initedRef.current = true;
            initRequestState({ showError, hideError, showToast, hideToast, showLoading, hideLoading });
        }
    }, [setError, setToast, setLoading]);
    return (
        <>
            <Error />
            <Loading />
            <Toast />
        </>
    );
}
