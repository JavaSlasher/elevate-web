import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
    {
      ignores: ['dist', 'node_modules'],
    },
    {
      files: ['**/*.{ts,tsx}'],
      extends: [
        js.configs.recommended,
        ...tseslint.configs.recommended,
        eslintConfigPrettier,
      ],
      languageOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        globals: {
          ...globals.browser,
        },
      },
      plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,

        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],

        'no-console': ['warn', { allow: ['warn', 'error'] }],
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/consistent-type-imports': [
          'error',
          { prefer: 'type-imports' },
        ],
        '@typescript-eslint/no-explicit-any': 'warn',
      },
    },
)
