import js from '@eslint/js';
import * as globals from 'globals';
import playwright from 'eslint-plugin-playwright';
import prettierConfig from 'eslint-config-prettier';

export default [
    {
        ignores: [
            '**/dist/**',
            '**/playwright-report/**',
            '**/test-results/**',
            '**/.lighthouseci/**',
            '**/coverage/**',
            '**/build/**',
            '**/node_modules/**'
        ]
    },
    {
        // Configuration for browser files
        files: [
            'js/**/*.js',
            'components/**/*.js',
            'assets/**/*.js',
            'sw.js'
        ],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.worker,
                document: true,
                window: true,
                navigator: true,
                location: true,
                localStorage: true,
                sessionStorage: true,
                requestAnimationFrame: true,
                IntersectionObserver: true,
                MutationObserver: true,
                ResizeObserver: true,
                Image: true,
                process: true,
                self: true,
                caches: true,
                MSApp: true,
                FontFace: true,
                __REACT_DEVTOOLS_GLOBAL_HOOK__: true,
                Buffer: true,
                reportError: true
            }
        },
        rules: {
            'no-undef': 'error',
            'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
            'getter-return': 'error',
            'valid-typeof': 'error',
            'no-prototype-builtins': 'off',
            'no-useless-escape': 'off',
        }
    },
    {
        // Configuration for Node.js files
        files: [
            '*.js',
            'scripts/**/*.js',
            'tests/**/*.js',
            '*.mjs',
            'tailwind.config.js',
            '.stylelintrc.js',
            'lighthouserc.js'
        ],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.nodeBuiltin,
                require: true,
                module: true,
                process: true,
                document: true, // For test files that interact with browser
                window: true    // For test files that interact with browser
            }
        },
        rules: {
            'no-undef': 'error',
            'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
            'no-empty': ['error', { 'allowEmptyCatch': true }],
            'no-constant-condition': ['error', { 'checkLoops': false }],
            'no-control-regex': 'off',
            'no-misleading-character-class': 'off',
            'no-useless-escape': 'off',
            'no-prototype-builtins': 'off',
            'no-cond-assign': ['error', 'except-parens'],
            'getter-return': 'error',
            'valid-typeof': 'error',
            'no-case-declarations': 'off',
            'no-fallthrough': 'off',
            'no-redeclare': 'off',
            'no-extra-boolean-cast': 'off',
        }
    },
    // Add base configurations
    js.configs.recommended,
    playwright.configs['flat/recommended'],
    prettierConfig
];
