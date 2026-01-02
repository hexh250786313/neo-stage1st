import { normalizePath } from './normalizePath';

export const isPathEqual = (url?: string, path?: string) => {
    if (!url || !path) {
        return false;
    }
    // 标准化路径，确保开头有/，结尾没有/（除非是根路径）

    // 移除查询参数和哈希部分
    const cleanUrl = url.split(/[?#]/)[0];

    // 标准化两个路径
    const normalizedUrl = normalizePath(cleanUrl);
    const normalizedPath = normalizePath(path);

    // 判断是否完全相等

    return normalizedUrl === normalizedPath;
};
