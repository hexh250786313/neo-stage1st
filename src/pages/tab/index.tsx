import { activeTabAtom } from '@/atoms/tab';
import CommonWrapper from '@/components/CommonWrapper';
import Routes from '@/constants/routes';
import useHeightOverride from '@/hooks/useHeightOverride';
import { useI18n } from '@/hooks/useI18n';
import usePageReturn from '@/hooks/usePageReturn';
import { Text, View } from '@tarojs/components';
import { useDidHide, useDidShow, useRouter } from '@tarojs/taro';
import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import Home from './components/Home';
import Message from './components/Message';
import Mine from './components/Mine';
import styles from './index.module.scss';

// Tab 配置
const TAB_CONFIG = [
    {
        component: Home,
    },
    {
        component: Message,
    },
    {
        component: Mine,
    },
] as const;

export default function Tab() {
    const [activeTab, setActiveTab] = useAtom(activeTabAtom);
    useHeightOverride();
    useI18n();
    useDidShow((...a) => {
        console.log('展示 home', a);
    });

    useDidHide((...a) => {
        console.log('隐藏 home', a);
    });

    useEffect(() => {
        console.log('初始化 home');
    }, []);

    usePageReturn((fromPath) => {
        // 如果是从登录返回，则重新刷新页面
        console.log('后退 来自', fromPath);
    }, Routes.Login);

    const test = useRouter();

    console.log('xxxxx', test);
    console.log('i18n render', TAB_CONFIG[0].component?.text);

    const renderTabContent = useCallback(() => {
        const tab = TAB_CONFIG.find((_it, index) => index === activeTab);
        return tab?.component ? <tab.component /> : null;
    }, [activeTab]);

    return (
        <CommonWrapper>
            <View className={styles.container}>
                hello
                <View
                    onClick={() => {
                        // Taro.navigateTo({
                        //     url: '/subpackages-login/pages/login/index',
                        // });
                    }}
                >
                    hello
                </View>
                <View className={styles.content}>{renderTabContent()}</View>
                <View className={styles['bottom-nav']}>
                    {TAB_CONFIG.map((tab, index) => (
                        <View
                            key={index}
                            className={`${styles['nav-item']} ${activeTab === index ? styles.active : ''}`}
                            onClick={() => setActiveTab(index)}
                        >
                            <View className={styles.icon}>
                                <Text className={tab.component?.icon}></Text>
                            </View>

                            <View className={styles.text}>{tab.component?.text}</View>
                        </View>
                    ))}
                </View>
            </View>
        </CommonWrapper>
    );
}
