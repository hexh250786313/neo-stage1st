/* eslint-disable */
const fs = require('fs');
const path = require('path');
const { parse } = require('jsonc-parser');

module.exports = (ctx, options) => {
    const generateScssVariables = () => {
        const variablesPath = path.resolve(ctx.paths.sourcePath, 'styles/variables/variables.jsonc');
        const outputPath = path.resolve(ctx.paths.sourcePath, 'styles/variables/_auto-generated.scss');

        try {
            if (!fs.existsSync(variablesPath)) {
                console.log('⚠️  未找到 variables.jsonc 文件');
                return;
            }

            // 读取 variables.jsonc
            const fileContent = fs.readFileSync(variablesPath, 'utf-8');
            const variables = parse(fileContent);

            // 生成 SCSS 内容
            let scssContent = '// 该文件由 variables.jsonc 自动生成，请勿手动修改\n\n';

            for (const [key, value] of Object.entries(variables)) {
                // 将驼峰命名转换为连字符命名
                const scssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                scssContent += `$${scssVarName}: ${value};\n`;
            }

            // 写入文件
            fs.writeFileSync(outputPath, scssContent, 'utf-8');
            console.log('✅ _auto-generated.scss 生成成功');
        } catch (error) {
            console.error('❌ 生成样式变量失败:', error);
        }
    };

    // 注册钩子
    ctx.register({
        name: 'onBuildStart',
        fn() {
            console.log('🚀 开始生成样式变量文件...');
            generateScssVariables();
        },
    });

    // watch 模式监听
    ctx.register({
        name: 'onBuildFinish',
        fn() {
            if (!ctx._variablesWatcher) {
                ctx._variablesWatcher = true;

                const variablesPath = path.resolve(ctx.paths.sourcePath, 'styles/variables/variables.jsonc');

                if (fs.existsSync(variablesPath)) {
                    fs.watch(variablesPath, (eventType) => {
                        if (eventType === 'change') {
                            console.log('📝 检测到 variables.jsonc 变化，重新生成样式文件...');
                            generateScssVariables();
                        }
                    });
                    console.log('👀 已开启 variables.jsonc 文件监听');
                }
            }
        },
    });
};
