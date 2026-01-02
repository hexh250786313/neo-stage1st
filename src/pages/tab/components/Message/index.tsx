import PullToRefresh from '@/components/PullToRefresh';
import { t } from '@/helpers/i18n';
import { attachPropertiesToComponent } from '@/utils/attachPropertiesToComponent';
import { Text, View } from '@tarojs/components';
import { memo, useEffect } from 'react';

function _Message() {
    useEffect(() => {
        return () => {
            console.log('组件销毁 message');
        };
    }, []);
    return (
        <PullToRefresh>
            <View>
                <Text>Tab 2 Content</Text>
            </View>
        </PullToRefresh>
    );
}

const Message = attachPropertiesToComponent(memo(_Message), {
    get text() {
        return t('tabs.message');
    },
    icon: 'fas fa-bell',
});

export default Message;
