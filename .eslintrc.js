const path = require('path');

module.exports = {
  ignorePatterns: ['dist/'],
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    "prettier",
    "prettier/@typescript-eslint",
    "plugin:react/recommended"
  ],
  plugins: ['@typescript-eslint', 'testing-library'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
  },
  overrides: [
    {
      "files": ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      "extends": ["plugin:testing-library/react"],
      rules: {
        'testing-library/await-async-utils': 'error',
        'testing-library/prefer-screen-queries': 'off',
        'testing-library/no-node-access': 'off',
        'testing-library/render-result-naming-convention': 'off',
        'testing-library/no-container': 'off',
      }
    },
  ],
};
