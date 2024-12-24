const path = require('path');
const eslintRecommended = require('@eslint/js');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const prettierPlugin = require('eslint-plugin-prettier');
const reactPlugin = require('eslint-plugin-react');

const commonGlobals = {
  __dirname: 'readonly',
  module: 'readonly',
  require: 'readonly',
  process: 'readonly',
  Buffer: 'readonly',
  console: 'readonly',
  JSX: 'readonly', // JSX 전역 변수
};

const commonRules = {
  'react/jsx-uses-react': 'off',
  'react/react-in-jsx-scope': 'off',
  'prettier/prettier': 'warn',
  'no-console': ['warn', {allow: ['warn', 'error']}],
  'no-debugger': 'warn',
};

module.exports = [
  eslintRecommended.configs.recommended,

  // JavaScript 설정
  {
    files: ['*.js', '*.jsx'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: commonGlobals,
    },
    plugins: {
      prettier: prettierPlugin,
      react: reactPlugin,
    },
    rules: {
      ...commonRules,
    },
  },

  // TypeScript 설정
  {
    files: ['*.ts', '*.tsx'],
    languageOptions: {
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        // eslint-disable-next-line no-undef
        project: path.resolve(__dirname, './tsconfig.json'),
      },
      globals: commonGlobals,
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
      react: reactPlugin,
    },
    rules: {
      ...commonRules,
      ...typescriptPlugin.configs.recommended.rules,
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
    },
  },
];
