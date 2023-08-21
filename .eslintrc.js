// eslint-disable-next-line no-undef
module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    ignorePatterns:[
        "/src/utils/AntiUtil.ts"
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        "@typescript-eslint/no-unused-vars":0,
        "@typescript-eslint/no-explicit-any":0,
        "@typescript-eslint/ban-ts-comment":0,
        "@typescript-eslint/no-var-requires":0
    },
};
