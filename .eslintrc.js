module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prefer-template': 'off',
    'max-len': 'off',
    'no-bitwise': 'off',
    'no-mixed-operators': 'off',
    'no-shadow': 'off',
    'prefer-destructuring': 'off',
    'func-names': ['error', 'as-needed'],
    'linebreak-style': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
