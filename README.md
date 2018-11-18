# standard-damn-it

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

configure your project to force all committed code to be formatted with standard with one command, `npx standard-damn-it`.

wires in [prettier-standard](https://www.npmjs.com/package/prettier-standard), the standard autoformatter, and triggers formatting automatically with `githooks`.  by default uses npm, but if a yarn.lock file is found, yarn will be used to install dependencies.

## usage

`npx standard-damn-it [--glob <src-glob>]`

```
$ standard-damn-it

  instantly setup standardjs formatting into your project via prettier-standard.
    setup commit hooks to autoformat committed code with husky & lint-staged.

  Usage
    $ standard-damn-it

  Options
    --glob <glob>, -g

  Examples
    $ standard-damn-it
    $ standard-damn-it --glob '{src,test,scripts}/**/*.{js,jsx,ts,tsx}'
```
