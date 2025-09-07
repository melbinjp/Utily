import js from '@eslint/js';
import globals from 'globals';
import playwright from 'eslint-plugin-playwright';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  playwright.configs['flat/recommended'],
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Add any custom rules here
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '.lighthouseci/'],
  },
];
