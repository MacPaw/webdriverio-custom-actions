'use strict';

module.exports = {
  extends: '@macpaw/eslint-config-webservices-base',

  parserOptions: {
    sourceType: 'script',
  },

  env: {
    node: true,
    es6: true,
    browser: true,
  },

  rules: {
    strict: ['error', 'global'],
  },

  globals: {
    $: 'readonly',
    $$: 'readonly',
    browser: 'readonly',
  },
};
