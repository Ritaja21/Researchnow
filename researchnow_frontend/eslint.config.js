import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default {
  ignorePatterns: ['dist'], // Use ignorePatterns instead of ignores
  overrides: [
    {
      files: ['**/*.{js,jsx}'],
      languageOptions: {
        ecmaVersion: 'latest',
        globals: globals.browser,
        parserOptions: {
          ecmaFeatures: { jsx: true },
          sourceType: 'module',
        },
      },
      settings: { react: { version: 'detect' } }, // Auto-detect React version
      plugins: ['react', 'react-hooks', 'react-refresh'], // Plugins should be an array
      rules: {
        ...js.configs.recommended.rules, // Fix reference
        ...react.configs.recommended.rules,
        ...react.configs['jsx-runtime'].rules,
        ...reactHooks.configs.recommended.rules,
        'react/jsx-no-target-blank': 'off',
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
      },
    },
  ],
}

