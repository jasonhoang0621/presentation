module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:react-hooks/recommended'],
  rules: {
    'react-hooks/exhaustive-deps': 'error',
    'no-unsafe-optional-chaining': false
  },
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false
  },
  plugins: ['react', 'react-hooks'],
  parser: '@babel/eslint-parser'
};
