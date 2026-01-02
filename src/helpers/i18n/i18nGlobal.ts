import { languages, ParamsType, SupportedLanguage, TranslationKey } from '@/locales';
import { getNestedValue } from '@/utils/getNestedValue';
import Taro from '@tarojs/taro';

// 获取当前语言
const getCurrentLanguage = (): SupportedLanguage => {
    const savedLang = Taro.getStorageSync('userLanguage') as SupportedLanguage;
    return savedLang && languages[savedLang] ? savedLang : 'zh-CN';
};

// 限制只接受有效的翻译键
export const t = <K extends TranslationKey>(key: K, params?: ParamsType<K>): string => {
    const lang = getCurrentLanguage();
    const value = getNestedValue(languages[lang], key);

    if (typeof value === 'function') {
        return value(params);
    }

    return value || `[Missing: ${key}]`;
};
