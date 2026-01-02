import { en } from './en';
import { TranslationType, zhCN } from './zh-CN';

// 支持的语言
export const languages = {
    'zh-CN': zhCN,
    en: en,
};

export type SupportedLanguage = keyof typeof languages;

// 使用字符串文本类型来获取所有可能的键路径
type Primitive = string | number | boolean | null | undefined;

// 为对象创建扁平化的键路径
type FlattenKeys<T, Prefix extends string = ''> = {
    [K in keyof T]: T[K] extends Primitive | Function
        ? `${Prefix}${string & K}`
        : `${Prefix}${string & K}` | FlattenKeys<T[K], `${Prefix}${string & K}.`>;
}[keyof T];

// 所有可能的翻译键路径，使用字符串文字类型
export type TranslationKey = FlattenKeys<TranslationType>;

// 递归获取路径对应的值类型
type GetValueType<T, P extends string> = P extends `${infer K}.${infer R}`
    ? K extends keyof T
        ? GetValueType<T[K], R>
        : never
    : P extends keyof T
      ? T[P]
      : never;

// 参数类型推导
export type ParamsType<K extends TranslationKey> =
    GetValueType<TranslationType, K> extends (params: infer P) => any ? P : never;

// 导出类型
export { en, zhCN };
export type { TranslationType };
