module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:react-hooks/recommended'],
  rules: {
    'react-hooks/exhaustive-deps': 'error',
    'no-unsafe-optional-chaining': 0
  },
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false
  },
  plugins: ['react', 'react-hooks', 'jsx'],
  parser: '@babel/eslint-parser'
};
