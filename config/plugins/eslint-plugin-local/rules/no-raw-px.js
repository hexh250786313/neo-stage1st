'use strict';

const PX_PATTERN = /\b\d+(\.\d+)?px\b/i;

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow any string literal or template literal containing px',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    allowList: {
                        type: 'array',
                        items: { type: 'string' },
                    },
                    allowZero: { type: 'boolean' },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            literal: 'String literal "{{value}}" contains "px". Use your px() helper instead.',
            template: 'Template literal contains "px". Use your px() helper instead.',
        },
    },

    create(context) {
        const options = context.options[0] || {};
        const allowList = new Set(options.allowList || []);
        const allowZero = options.allowZero !== false;

        const containsPx = (text) => {
            if (allowZero && /\b0px\b/i.test(text)) {
                return false;
            }
            return PX_PATTERN.test(text);
        };

        const isAllowed = (text) => allowList.has(text);

        return {
            Literal(node) {
                if (typeof node.value !== 'string') return;
                if (isAllowed(node.value)) return;
                if (containsPx(node.value)) {
                    context.report({
                        node,
                        messageId: 'literal',
                        data: { value: node.value },
                    });
                }
            },
            TemplateLiteral(node) {
                const cooked = node.quasis.map((q) => q.value.cooked || '').join('');
                if (isAllowed(cooked)) return;
                if (containsPx(cooked)) {
                    context.report({
                        node,
                        messageId: 'template',
                    });
                }
            },
        };
    },
};
