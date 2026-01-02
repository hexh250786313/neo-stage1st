import { errorQueueAtom, errorVisibleAtom } from '@/atoms/error';
import { View } from '@tarojs/components';
import classNames from 'classnames';
import { useAtomValue } from 'jotai';
import commonStyles from '../../index.module.scss';
import styles from './index.module.scss';

export default function Error() {
    const errors = useAtomValue(errorQueueAtom);
    const visible = useAtomValue(errorVisibleAtom);
    const errorMsg = errors?.[errors?.length - 1]?.message;
    return (
        <View className={classNames(styles['container'], { [`${styles.hidden}`]: !visible })}>
            <View className={commonStyles['backdrop']} />
            <View className={commonStyles['layer-panel']}>
                <View className={styles['icon-wrapper']}>
                    <View className={styles['icon-circle']} />
                    <View className={styles['icon-line']} />
                    <View className={styles['icon-line']} />
                </View>
                {errorMsg ? <View className={styles['message']}>{errorMsg}</View> : null}
            </View>
        </View>
    );
}
