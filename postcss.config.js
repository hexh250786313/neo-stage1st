/* eslint-disable */
module.exports = {
    plugins: [
        require('postcss-autoreset')({
            rulesMatcher: (rule) => true,
            reset: {
                boxSizing: 'border-box',
                overscrollBehaviorY: 'contain',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
            },
        }),
    ],
};
