module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',

    // Enforce the use of async/await instead of callbacks
    // 'node/no-callback-literal': 'error',

    '@typescript-eslint/no-explicit-any': ['off'],

    // Require or disallow named function expressions
    'func-names': 'off',
    'no-var': 'off',
    'no-inner-declarations': 'off',
    '@typescript-eslint/no-unused-vars': ['off'],

    // Enforce consistent indentation
    // indent: ['error', 2],

    // Enforce consistent spacing inside array brackets
    // 'array-bracket-spacing': ['error', 'never'],

    // Enforce consistent spacing inside object literals
    // 'object-curly-spacing': ['error', 'always'],

    // Enforce consistent spacing before or after arrow function's arrow
    // 'arrow-spacing': 'error',
  },
};
