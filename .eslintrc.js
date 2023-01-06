module.exports = {
  extends: ['plugin:prettier/recommended', 'plugin:react-hooks/recommended'],
  rules: {
    'react-hooks/exhaustive-deps': 'error',
    'no-unsafe-optional-chaining': 0
  },
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react']
    }
  },
  plugins: ['react', 'jsx', 'react-hooks'],
  parser: '@babel/eslint-parser'
};
