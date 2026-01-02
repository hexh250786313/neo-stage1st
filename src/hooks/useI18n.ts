import { localeAtom, translationsAtom } from '@/atoms/locale';
import { ParamsType, SupportedLanguage, TranslationKey } from '@/locales';
import { getNestedValue } from '@/utils/getNestedValue';
import Taro from '@tarojs/taro';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';

export function useI18n() {
    const [locale, setLocale] = useAtom(localeAtom);
    const translations = useAtomValue(translationsAtom);

    // 限制只接受有效的翻译键
    const t = useCallback(
        <K extends TranslationKey>(key: K, params?: ParamsType<K>): string => {
            const value = getNestedValue(translations, key);
            if (typeof value === 'function') {
                return value(params);
            }
            return value || `[Missing: ${key}]`;
        },
        [translations],
    );

    // 切换语言
    const changeLanguage = useCallback(
        (lang: SupportedLanguage) => {
            setLocale(lang);
            Taro.setStorageSync('userLanguage', lang);
        },
        [setLocale],
    );

    return {
        t,
        changeLanguage,
        currentLanguage: locale,
    };
}
