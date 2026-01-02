import { error } from '@/atoms/error';
import { loading } from '@/atoms/loading';
import { toast } from '@/atoms/toast';
import { userInfoAtom } from '@/atoms/user';
import FormInput from '@/components/FormInput';
import PullToRefresh from '@/components/PullToRefresh';
import { t } from '@/helpers/i18n';
import { navigateToLogin } from '@/helpers/navigation';
import useUserInfo from '@/requests/use/useUserInfo';
import { isInited } from '@/utils';
import { attachPropertiesToComponent } from '@/utils/attachPropertiesToComponent';
import { Button, View } from '@tarojs/components';
import { AxiosRequestConfig } from 'axios';
import { useAtom } from 'jotai';
import { memo, useCallback, useEffect } from 'react';
import { TabProps } from '../../types';
import styles from './index.module.scss';

function _Home(_props: TabProps) {
    const { fetchUserInfo: fetchUserInfo1, userInfo: userInfo1 } = useUserInfo();
    const { fetchUserInfo: fetchUserInfo2, userInfo: userInfo2 } = useUserInfo();
    const [userInfo, setUserInfo] = useAtom(userInfoAtom);

    console.log({
        userInfo1,
        userInfo2,
    });

    const fetch1 = useCallback(
        (options?: AxiosRequestConfig) => {
            return fetchUserInfo1(undefined, options);
        },
        [fetchUserInfo1],
    );

    console.log('iii');

    const fetch2 = useCallback(
        (options?: AxiosRequestConfig) => {
            return fetchUserInfo2(undefined, options);
        },
        [fetchUserInfo2],
    );

    const refetch = useCallback(() => {
        navigateToLogin();

        // return fetch1({ silent: false, useCache: false });
    }, []);

    const pullToRefresh = useCallback(() => {
        return fetch1({ silent: true, useCache: false });
    }, [fetch1]);

    useEffect(() => {
        if (isInited(userInfo1)) {
            setUserInfo(userInfo1);
        }
    }, [userInfo1, setUserInfo]);

    useEffect(() => {
        (async () => {
            try {
                if (isInited(userInfo)) {
                    return;
                }
                await fetch2({
                    silent: false,
                });
                // await fetch2({
                //     silent: false,
                //     useCache: false,
                // });
            } catch (e) {
                console.error(e);
            }
        })();
    }, [fetch1, fetch2, userInfo]);

    useEffect(() => {
        return () => {
            console.log('销毁');
        };
    }, []);
    console.log(userInfo?.username, userInfo1?.username, userInfo2?.username);

    return (
        <PullToRefresh onRefresh={pullToRefresh}>
            <View className={styles.container}>
                {userInfo?.username}
                {userInfo1?.username}
                {userInfo2?.username}
                <FormInput />
                <Button className="custom" onClick={refetch}>
                    click
                </Button>
                <Button
                    className="custom"
                    onClick={() => {
                        loading.show();
                    }}
                >
                    click
                </Button>
                <Button
                    className="custom"
                    onClick={() => {
                        loading.hide();
                    }}
                >
                    click
                </Button>
                <Button
                    className="custom"
                    onClick={() => {
                        error.show(new Error('测试全局错误处理1'), 10000);
                    }}
                >
                    click
                </Button>
                <Button
                    className="custom"
                    onClick={() => {
                        error.show(new Error('2222222222'));
                    }}
                >
                    click
                </Button>
                <Button
                    className="custom"
                    onClick={() => {
                        error.hide();
                    }}
                >
                    click
                </Button>
                <Button
                    className="custom"
                    onClick={() => {
                        toast.hide();
                    }}
                >
                    click
                </Button>
                <Button
                    className="custom"
                    onClick={() => {
                        toast.show(
                            'werwerzzzzzzvaaaaafffffffffffffffffffffffffffffffffffffffasdddddddddddddddddddddddddddddddddddddddddddddddddddddddZXXXXCcc::::::::::::w',
                            500000,
                        );
                    }}
                >
                    click
                </Button>
            </View>
        </PullToRefresh>
    );
}

const Home = attachPropertiesToComponent(memo(_Home), {
    get text() {
        return t('tabs.home');
    },
    icon: 'fas fa-home',
});

export default Home;
