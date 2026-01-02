import { getCssVariable } from '@/helpers/ui';
import { ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import PullToRefreshForH5 from './PullToRefreshForH5';

interface PullToRefreshProps {
    onRefresh?: (params?: unknown) => Promise<unknown>;
    children: React.ReactNode;
}
const PullToRefreshForMiniProgram = (props: PullToRefreshProps) => {
    const { onRefresh, children } = props;
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        return () => {
            console.log('组件销毁 pull');
        };
    }, []);
    return (
        <ScrollView
            className={styles.container}
            refresherBackground={getCssVariable('color-bg-primary')}
            scrollY
            refresherEnabled
            refresherTriggered={refreshing}
            onRefresherRefresh={async () => {
                setRefreshing(true);
                try {
                    await onRefresh?.();
                    // 变成宏任务，有时候异步任务太快的话，它无法触发变化
                    // 例如 onRefresh 直接就是一个同步任务改异步任务的时候
                    // 变化得太快，会导致它一直处于 false 的状态
                    // 所以加一个延迟
                } catch (e) {
                    console.error('PullToRefreshForMiniProgram onRefresh error:', e);
                }
                setTimeout(() => {
                    setRefreshing(false);
                });
            }}
        >
            {children}
        </ScrollView>
    );
};

const PullToRefresh = (props: PullToRefreshProps) => {
    const env = Taro.getEnv();

    if (env === 'WEAPP') {
        return <PullToRefreshForMiniProgram {...props} />;
    } else if (env === 'WEB') {
        return <PullToRefreshForH5 {...props} />;
    }
};

export default PullToRefresh;
