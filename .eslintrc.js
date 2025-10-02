module.exports = {
    extends: [
        'taro/react',
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    plugins: ['react', '@typescript-eslint', 'react-hooks'], // @typescript-eslint 即 @typescript-eslint/eslint-plugin 和 @typescript-eslint/parser，已经被 eslint-config-taro 集成，无需额外安装
    rules: {
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'import/no-commonjs': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
    },
};
