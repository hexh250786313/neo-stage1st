module.exports = {
    plugins: [
        require.resolve('prettier-plugin-organize-imports'), // 作用是：自动按照字母顺序排序 import
        'prettier-plugin-packagejson',
    ],
    printWidth: 120,
    proseWrap: 'never',
    singleQuote: true,
    trailingComma: 'all',
    tabWidth: 4,
    semi: true,
    overrides: [
        {
            files: '*.md',
            options: {
                proseWrap: 'preserve',
                tabWidth: 2,
            },
        },
    ],
};
