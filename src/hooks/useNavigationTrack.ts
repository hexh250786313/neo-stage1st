import { appInitedAtom } from '@/atoms/appInit';
import { NavigationTracker } from '@/services/navigation';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

const useNavigationTrack = () => {
    const appInited = useAtomValue(appInitedAtom);

    useEffect(() => {
        if (!appInited) {
            return;
        }

        const tracker = NavigationTracker.getInstance();

        // 页面加载的时候，增加对当前页面的访问记录
        tracker.recordVisit();

        return () => {
            // 页面卸载时移除页面访问记录
            tracker.removeVisit();
        };
    }, [appInited]);
};

export default useNavigationTrack;
