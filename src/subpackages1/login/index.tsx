import { userInfoAtom } from '@/atoms/user';
import CommonWrapper from '@/components/CommonWrapper';
import FormInput from '@/components/FormInput';
import Routes from '@/constants/routes';
import { isRequestSuccess } from '@/helpers/api';
import { setAuthToken } from '@/helpers/auth';
import { useLoginNavigationLock } from '@/helpers/navigation';
import { useI18n } from '@/hooks/useI18n';
import usePageForward from '@/hooks/usePageForward';
import { getUserInfo } from '@/requests/apis/getUserInfo';
import { login } from '@/requests/apis/login';
import { isInited } from '@/utils';
import { Button, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import styles from './index.module.scss';

export default function Login() {
    useLoginNavigationLock();
    const { t } = useI18n();
    const [, setUserInfo] = useAtom(userInfoAtom);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [accountError, setUsernameError] = useState<string>();
    const [passwordError, setPasswordError] = useState<string>();
    usePageForward((fromPath) => {
        console.log('前进 来自', fromPath);
    }, Routes.Tab);
    const handleAccountInput = useCallback((value: string) => {
        setUsername(value);
    }, []);
    const handlePasswordInput = useCallback((value: string) => {
        setPassword(value);
    }, []);
    const handleAccountError = useCallback((error: string) => {
        setUsernameError(error);
    }, []);
    const handlePasswordError = useCallback((error: string) => {
        setPasswordError(error);
    }, []);
    useEffect(() => {
        if (username && password) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
    }, [username, password]);
    const submit = useCallback(async () => {
        if (!username) {
            setUsernameError('请输入用户名');
        }
        if (!password) {
            setPasswordError('请输入密码');
        }
        if (!isInited(password) || !isInited(username)) return;
        setBtnDisabled(true);
        try {
            const res = await login({
                username,
                password,
            });
            if (isRequestSuccess(res)) {
                setAuthToken({
                    auth: res.data.auth,
                    saltkey: res.data.saltkey,
                    uid: res.data.member_uid,
                });
                const userInfoRes = await getUserInfo();

                if (isRequestSuccess(res)) {
                    setUserInfo(userInfoRes.data);
                    Taro.navigateBack();
                }
            }
        } catch (e) {
            console.error('Login failed:', e);
        }
        if (isInited(password) && isInited(username)) {
            setBtnDisabled(false);
        }
    }, [username, password, setUserInfo]);
    return (
        <CommonWrapper>
            <View className={styles.container}>
                <View className={styles.main}>
                    <Button onClick={() => Taro.navigateBack()}>hello</Button>
                    <View className={styles.card}>
                        <View className={styles.header}>{t('common.brand')}</View>
                        <View className={styles['sub-title']}>{t('login.subTitle')}</View>
                        <View className={styles['form']}>
                            <FormInput
                                label={t('login.label1')}
                                placeholder={t('login.placeholder1')}
                                onInput={handleAccountInput}
                                onError={handleAccountError}
                                error={accountError}
                                required
                                requiredMessage="请输入用户名"
                            />
                            <FormInput
                                label={t('login.label2')}
                                placeholder={t('login.placeholder2')}
                                onInput={handlePasswordInput}
                                onError={handlePasswordError}
                                error={passwordError}
                                required
                                requiredMessage="请输入密码"
                                password
                            />

                            <Button
                                className={`${styles.login} ${btnDisabled ? styles['btn-disabled'] : ''}`}
                                onClick={submit}
                                disabled={btnDisabled}
                            >
                                {t('login.login')}
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        </CommonWrapper>
    );
}
