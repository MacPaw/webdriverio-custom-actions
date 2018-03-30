module.exports = {
  extends: [
    '@macpaw/eslint-config-webservices/rules/base',
    '@macpaw/eslint-config-webservices/rules/filenames',
    '@macpaw/eslint-config-webservices/rules/promise',
  ],
  parser: 'espree',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'script',
  },
  plugins: ['async-await'],
  rules: {
    strict: ['warn', 'global'],
    'no-unused-expressions': ['off'],
    'newline-after-var': ['off'],
    'filenames/match-regex': ['off'],
  },
};