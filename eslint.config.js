// ESLint v9+ flat config migration from .eslintrc.json
import js from '@eslint/js';
import github from 'eslint-plugin-github';
import jest from 'eslint-plugin-jest';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

export default [
  // Global ignores (must be first)
  {
    ignores: ['dist/**', 'lib/**', 'node_modules/**', 'jest.config.js']
  },
  
  // Base configurations
  js.configs.recommended,
  ...tseslint.configs.recommended,
  
  // Plugin configurations for specific file types
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      github,
      jest,
      prettier,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
      }
    },
    rules: {
      'i18n-text/no-en': 'off',
      'eslint-comments/no-use': 'off',
      'import/no-namespace': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      'camelcase': 'off',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      'semi': 'off',
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
];
