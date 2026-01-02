import { languages, SupportedLanguage } from '@/locales';
import Taro from '@tarojs/taro';
import { atom } from 'jotai';

// 获取初始语言

const getInitialLanguage = (): SupportedLanguage => {
    const savedLang = Taro.getStorageSync('userLanguage') as SupportedLanguage;
    if (savedLang && languages[savedLang]) return savedLang;
    try {
        const systemInfo = Taro.getSystemInfoSync();
        const systemLanguage = systemInfo.language || '';

        if (systemLanguage.startsWith('zh')) return 'zh-CN';
        if (systemLanguage.startsWith('en')) return 'en';

        return 'zh-CN';
    } catch (e) {
        console.log(e);
        return 'zh-CN';
    }
};

// 当前语言代码
export const localeAtom = atom<SupportedLanguage>(getInitialLanguage());

// 当前语言的翻译内容
export const translationsAtom = atom((get) => languages[get(localeAtom)]);
