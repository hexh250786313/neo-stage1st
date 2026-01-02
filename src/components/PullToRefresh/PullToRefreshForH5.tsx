import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './PullToRefreshForH5.module.scss';

interface Props {
    onRefresh?: () => Promise<unknown>;
    children: React.ReactNode;
    className?: string;
}
const THRESHOLD = 60;
export const PullToRefreshForH5: React.FC<Props> = ({ onRefresh, children, className = '' }) => {
    const [pulling, setPulling] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [pullHeight, setPullHeight] = useState(0);
    const elementRef = useRef<HTMLDivElement>(null);
    const startYRef = useRef(0);
    const handleTouchStart = useCallback(
        (e: TouchEvent) => {
            // 如果正在刷新中，不允许再次触发下拉
            if (refreshing) return;
            if (elementRef.current!.scrollTop === 0) {
                startYRef.current = e.touches[0].clientY;
                setPulling(true);
            }
        },
        [refreshing],
    );
    const handleTouchMove = useCallback(
        (e: TouchEvent) => {
            if (!pulling || refreshing) return;
            const touch = e.touches[0];
            const deltaY = touch.clientY - startYRef.current;
            if (deltaY > 0) {
                e.preventDefault();
                // setPullHeight(Math.min(deltaY * 0.5, THRESHOLD * 1.5));
                setPullHeight(Math.min(deltaY * 0.5, THRESHOLD));
            }
        },
        [pulling, refreshing],
    );
    const handleTouchEnd = useCallback(async () => {
        if (!pulling || refreshing) return;
        setPulling(false);
        if (pullHeight >= THRESHOLD) {
            setRefreshing(true);
            try {
                await onRefresh?.();
            } catch (e) {
                console.error(e);
            } finally {
                setRefreshing(false);
            }
        }
        setPullHeight(0);
    }, [onRefresh, pullHeight, pulling, refreshing]);
    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;
        element.addEventListener('touchstart', handleTouchStart);

        element.addEventListener('touchmove', handleTouchMove, { passive: false });
        element.addEventListener('touchend', handleTouchEnd);
        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleTouchStart, handleTouchMove, handleTouchEnd]);
    return (
        <div className={styles.container}>
            <div
                className={`${styles.indicator} ${refreshing ? styles.refreshing : ''}`}
                style={{
                    transform: `translateY(${pullHeight / 2}px)`,
                    opacity: pullHeight / THRESHOLD,
                }}
            >
                <div className={styles.dots}>
                    <div />
                    <div />
                    <div />
                </div>
            </div>
            <div
                ref={elementRef}
                className={`${styles.wrapper} ${className}`}
                style={{ transform: `translateY(${pullHeight}px)` }}
            >
                {children}
            </div>
        </div>
    );
};
export default PullToRefreshForH5;
