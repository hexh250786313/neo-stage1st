// 获取嵌套属性的辅助函数
export const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((prev, curr) => {
        return prev && prev[curr] ? prev[curr] : null;
    }, obj);
};
