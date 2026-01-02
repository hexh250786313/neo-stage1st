import { px } from '@/utils';
import { BaseEventOrig, CommonEventFunction, InputProps, Input as TaroInput, Text, View } from '@tarojs/components';
import { ComponentType, useCallback, useState } from 'react';
import styles from './index.module.scss';

const Input: ComponentType<
    InputProps & {
        focusedClassName?: string;
        passwordToggle?: boolean;
    }
> = (
    props: InputProps & {
        focusedClassName?: string;
        passwordToggle?: boolean;
    },
) => {
    const [isFocused, setIsFocused] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const handleFocus = useCallback(
        (e: BaseEventOrig<InputProps.inputForceEventDetail>) => {
            setIsFocused(true);
            props.onFocus && props.onFocus(e);
        },
        [props.onFocus],
    );
    const handleBlur = useCallback<CommonEventFunction<InputProps.inputValueEventDetail>>(
        (e) => {
            setIsFocused(false);
            props.onBlur && props.onBlur(e);
        },
        [props.onBlur],
    );
    const togglePasswordVisibility = useCallback(() => {
        setPasswordVisible((prev) => !prev);
    }, []);
    const { password, className, focusedClassName, ...restProps } = props;
    const showPasswordToggle = !!password;
    const showPassword = password && !passwordVisible;
    return (
        <View className={styles['input-container']}>
            <TaroInput
                {...restProps}
                className={`${className} ${isFocused ? focusedClassName : ''}`}
                onFocus={handleFocus}
                onBlur={handleBlur}
                password={showPassword}
                style={{
                    ...(props.style as any),
                    paddingLeft: px(16),
                    paddingRight: showPasswordToggle ? px(44) : px(16),
                }}
            />
            {showPasswordToggle && (
                <View onClick={togglePasswordVisibility} className={styles.eye}>
                    <Text className={passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'} />
                </View>
            )}
        </View>
    );
};

export default Input;
