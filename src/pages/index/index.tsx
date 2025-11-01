import { Text, View } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import './index.scss';

export default function Index() {
    useLoad(() => {
        console.log('Page loaded.');
    });

    return (
        <View className="index">
            <Text>Hello worldwwww!</Text>
            <Text className="fas fa-home" />
        </View>
    );
}
