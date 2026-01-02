/* eslint-disable */
const fs = require('fs');
const path = require('path');
const { parse } = require('jsonc-parser');
const chokidar = require('chokidar');

module.exports = (ctx, options) => {
    const variablesDir = path.resolve(ctx.paths.sourcePath, 'styles/variables');
    const variablesPath = path.join(variablesDir, 'variables.jsonc');
    const scssOutputPath = path.join(variablesDir, '_auto-generated.scss');
    const jsonOutputPath = path.join(variablesDir, '_auto-generated.json');

    const generateVariablesFiles = () => {
        try {
            if (!fs.existsSync(variablesPath)) {
                console.log('⚠️  未找到 variables.jsonc 文件');
                return;
            }

            const fileContent = fs.readFileSync(variablesPath, 'utf-8');
            const variables = parse(fileContent);

            let scssContent = '// 该文件由 variables.jsonc 自动生成，请勿手动修改\n\n';
            for (const [key, value] of Object.entries(variables)) {
                const scssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                scssContent += `$${scssVarName}: ${value};\n`;
            }
            fs.writeFileSync(scssOutputPath, scssContent, 'utf-8');
            console.log('✅ _auto-generated.scss 生成成功');

            const jsonContent = JSON.stringify(variables, null, 2);
            fs.writeFileSync(jsonOutputPath, jsonContent, 'utf-8');
            console.log('✅ _auto-generated.json 生成成功');
        } catch (error) {
            console.error('❌ 生成变量文件失败:', error);
        }
    };

    ctx.register({
        name: 'onBuildStart',
        fn() {
            console.log('🚀 开始生成样式变量文件...');
            generateVariablesFiles();
        },
    });

    ctx.register({
        name: 'onBuildFinish',
        fn() {
            if (ctx._variablesWatcher) return;

            if (!fs.existsSync(variablesPath)) {
                console.log('⚠️  未找到 variables.jsonc，监听暂不启动');
                return;
            }

            ctx._variablesWatcher = chokidar.watch(variablesPath, {
                ignoreInitial: true,
                awaitWriteFinish: {
                    stabilityThreshold: 200,
                    pollInterval: 100,
                },
            });

            ctx.register({
                name: 'onDispose',
                fn() {
                    if (ctx._variablesWatcher) {
                        ctx._variablesWatcher.close();
                        ctx._variablesWatcher = null;
                        console.log('👋 变量监听已关闭');
                    }
                },
            });

            ctx._variablesWatcher.on('change', () => {
                console.log('📝 检测到 variables.jsonc 变化，重新生成文件...');
                generateVariablesFiles();
            });

            ctx._variablesWatcher.on('error', (err) => {
                console.error('⚠️  监听 variables.jsonc 时发生错误:', err);
            });

            console.log('👀 已开启 variables.jsonc 文件监听（chokidar）');
        },
    });
};
