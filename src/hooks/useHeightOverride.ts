import { useLayoutEffect } from 'react';

declare global {
    interface Window {
        initialHeight?: number;
    }
}

const useHeightOverride = () => {
    useLayoutEffect(() => {
        document.documentElement.style.height = window.initialHeight + 'px';
    }, []);
};

export default useHeightOverride;
