# standard-damn-it

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

automatically update a npm-based project to force all committed code to be formatted with standard.

wires in [prettier-standard](https://www.npmjs.com/package/prettier-standard), the standard autoformatter, and triggers formatting automatically with `githooks`.

## usage

`npx standard-damn-it <src-glob>`

- `src-glob`, default: `src/**/*.js`
