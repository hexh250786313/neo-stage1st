/** @type {import('stylelint').Config} */
export default {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-standard-scss', // 添加 SCSS 支持
    ],
    rules: {
        // 允许空文件
        'no-empty-source': null,
        // 允许不存在的标签
        'selector-type-no-unknown': null,
    },
};
