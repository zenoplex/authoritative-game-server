module.exports = {
  extends: [
    'standard',
    'plugin:promise/recommended',
    'plugin:jest/recommended',
    'plugin:unicorn/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaVersion:  2018,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
        trailingComma: 'all',
      },
    ],
    // "@typescript-eslint/explicit-function-return-type": ["error", {
    //   "allowTypedFunctionExpressions": true
    // }],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-object-literal-type-assertion': 0,
    'unicorn/filename-case': 0,
    'unicorn/prevent-abbreviations': 0,
    'unicorn/number-literal-case': 0,
  },
  env: {
    jest: true,
  },
  globals: {
    fetch: false,
  },
};
