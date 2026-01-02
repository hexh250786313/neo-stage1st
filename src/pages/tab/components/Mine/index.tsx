import { t } from '@/helpers/i18n';
import { attachPropertiesToComponent } from '@/utils/attachPropertiesToComponent';
import { Text, View } from '@tarojs/components';
import { atom, useAtom } from 'jotai';
import { memo, useEffect } from 'react';
import { TabProps } from '../../types';

// 创建一个原子状态
const jjAtom = atom(0);

function _Mine(_props: TabProps) {
    // 使用 jotai 的 useAtom 替代 useState
    const [jj, setJJ] = useAtom(jjAtom);
    console.log('render');

    const goToMessage = () => {
        // Taro.navigateTo({
        //     url: '/subpackages-login/pages/login/index',
        // });
    };

    useEffect(() => {
        return () => {
            console.log('组件销毁 mine');
        };
    }, []);

    return (
        <View>
            <Text onClick={goToMessage}>{jj}Go to message</Text>

            <View onClick={() => setJJ((prev) => prev + 1)}>jjjjjj</View>
        </View>
    );
}

const Mine = attachPropertiesToComponent(memo(_Mine), {
    get text() {
        return t('tabs.mine');
    },
    icon: 'fas fa-user',
});

export default Mine;
