import { View } from '@tarojs/components';
import { ComponentType, PropsWithChildren } from 'react';
import styles from './index.module.scss';

const SafeAreaWrapper: ComponentType<PropsWithChildren> = (props: PropsWithChildren) => {
    return <View className={styles.container}>{props.children}</View>;
};
export default SafeAreaWrapper;
