import Input from '@/components/Input';
import { BaseEventOrig, CommonEventFunction, InputProps, View } from '@tarojs/components';
import { FC, useCallback, useEffect, useState } from 'react';
import styles from './index.module.scss';

export interface FormInputProps extends Omit<InputProps, 'onInput'> {
    label?: string;
    error?: string;
    onInput?: (value: string, event: BaseEventOrig<InputProps.inputValueEventDetail>) => void;
    onError?: (error: string) => void;
    validateOnChange?: boolean;
    required?: boolean;
    requiredMessage?: string;
    validator?: (value: string) => string | undefined;
}
const FormInput: FC<FormInputProps> = ({
    label,
    error,
    onInput,
    onError,
    validateOnChange = true,
    required = false,
    requiredMessage = '此项不能为空',
    validator,
    className,
    ...props
}) => {
    const [localError, setLocalError] = useState(error || '');
    const [isTouched, setIsTouched] = useState(false);
    useEffect(() => {
        setLocalError(error || '');
    }, [error]);
    const validate = (value: string): string => {
        if (required && !value) {
            return requiredMessage;
        }
        if (validator && value) {
            const validationError = validator(value);
            if (validationError) return validationError;
        }
        return '';
    };
    const handleInput = (e: BaseEventOrig<InputProps.inputValueEventDetail>) => {
        const value = e.detail.value;
        if (validateOnChange && isTouched) {
            const validationError = validate(value);
            setLocalError(validationError);
            onError?.(validationError);
        }
        onInput?.(value, e);
    };
    const handleBlur = useCallback<CommonEventFunction<InputProps.inputValueEventDetail>>((e) => {
        setIsTouched(true);
        const value = e.detail.value;
        const validationError = validate(value);
        setLocalError(validationError);
        onError?.(validationError);
        props.onBlur?.(e);
    }, []);

    return (
        <View className={styles['form-group']}>
            {label && <View className={styles.label}>{label}</View>}
            <Input
                className={`${styles.input} ${localError ? styles['input-error'] : ''} ${className || ''}`}
                focusedClassName={localError ? styles['input-error-focus'] : styles['input-focus']}
                onInput={handleInput}
                onBlur={handleBlur}
                {...props}
            />

            {localError && <View className={styles['error-tip']}>{localError}</View>}
        </View>
    );
};

export default FormInput;
