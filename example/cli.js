#!/usr/bin/env node
require('scritch')(__dirname, {
  help: `
    Examples
      Build all files:
      $ company-cli build

      Lint all files:
      $ company-cli lint

      Run all tests:
      $ company-cli test
  `,
  env: {
    HELPER_ENV_VARIABLE: 'some value'
  }
})
