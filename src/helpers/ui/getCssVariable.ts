import variablesJson from '@/styles/variables/_auto-generated.json';
// 定义强类型的变量名称
type VariableKeys = keyof typeof variablesJson;
/**
 * 获取样式变量的值
 * @param variableName 变量名称
 * @returns 变量的实际值（如果是引用变量，则返回引用的值）
 */
export function getCssVariable(variableName: VariableKeys): string {
    const value = variablesJson[variableName];
    // 处理引用变量（以$开头的变量）
    if (typeof value === 'string' && value.startsWith('$')) {
        const referencedVarName = value.substring(1) as VariableKeys;
        return getCssVariable(referencedVarName);
    }
    return value;
}
