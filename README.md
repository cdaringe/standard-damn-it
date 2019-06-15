# standard-damn-it

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

single command setup for a complete [standardjs](https://standardjs.com/) lint & format experience for javascript & typescript projects.

configure your project to:

- format with standard-prettier
- lint with standard
- wire in typescript support if found in your dependencies
- format & lint on git commit

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
