import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
    {
        files: ['**/*.{js,jsx}'],
        ignores: ['node_modules/**', 'build/**'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                vi: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                global: 'readonly'
            },
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,
            'react/prop-types': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-react': 'off',
            'no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_'
            }],
        },
        settings: {
            react: { version: '18.2' },
        },
    },
];
