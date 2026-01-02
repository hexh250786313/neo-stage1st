// 标准化路径，确保开头有/，结尾没有/（除非是根路径）
export const normalizePath = (inputPath: string): string => {
    let normalized = inputPath.startsWith('/') ? inputPath : `/${inputPath}`;

    if (normalized.endsWith('/') && normalized !== '/') {
        normalized = normalized.slice(0, -1);
    }

    return normalized;
};
