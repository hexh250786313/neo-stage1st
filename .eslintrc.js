module.exports = {
    extends: [
        'taro/react',
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    plugins: ['react', '@typescript-eslint', 'react-hooks', 'local'],
    rules: {
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'import/no-commonjs': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-types': 'off',
        'local/no-raw-px': ['error', { allowZero: false, allowList: [] }],
    },
};
