import { toastQueueAtom, toastVisibleAtom } from '@/atoms/toast';
import { View } from '@tarojs/components';
import classNames from 'classnames';
import { useAtomValue } from 'jotai';
import commonStyles from '../../index.module.scss';
import styles from './index.module.scss';

export default function Toast() {
    const toasts = useAtomValue(toastQueueAtom);
    const visible = useAtomValue(toastVisibleAtom);
    const toastMsg = toasts?.[toasts?.length - 1]?.message;

    return (
        <View className={classNames(styles['container'], { [`${styles.hidden}`]: !visible })}>
            <View className={commonStyles['backdrop']} />
            <View className={commonStyles['layer-panel']}>
                <View className={styles['icon-wrapper']}>
                    <View className={styles['icon-circle']} />
                    <View className={styles['icon-exclamation-line']} />
                    <View className={styles['icon-exclamation-dot']} />
                </View>
                {toastMsg ? <View className={styles['message']}>{toastMsg}</View> : null}
            </View>
        </View>
    );
}
