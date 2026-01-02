import { loadingAtom } from '@/atoms/loading';
import { useI18n } from '@/hooks/useI18n';
import { View } from '@tarojs/components';
import classNames from 'classnames';
import { useAtomValue } from 'jotai';
import commonStyles from '../../index.module.scss';
import styles from './index.module.scss';

export default function Loading() {
    const loading = useAtomValue(loadingAtom);
    const { t } = useI18n();
    return (
        <View className={classNames(styles['container'], { [`${styles.hidden}`]: !loading })}>
            <View className={commonStyles['backdrop']} />
            <View className={commonStyles['layer-panel']}>
                <View className={styles['spinner']} />
                <View className={styles['message']}>{t('common.processing')}</View>
            </View>
        </View>
    );
}
