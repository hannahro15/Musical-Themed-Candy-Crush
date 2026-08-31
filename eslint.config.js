import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  },
  {
    files: ['__tests__/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node
      }
    },
    rules: {
      // gameController.test.js reassigns properties on the `dom` namespace
      // import to mock DOM elements — not spec-legal ESM, but Babel/Jest
      // transpile it to a mutable object, so it works here in practice.
      'no-import-assign': 'off'
    }
  },
  {
    files: ['build-www.js', 'jest.config.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    }
  },
  {
    ignores: ['www/**', 'coverage/**', 'android/**', 'node_modules/**']
  }
];
