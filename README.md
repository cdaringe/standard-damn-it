# standard-damn-it

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

automatically update a npm-based project to force all committed code to be formatted with standard.

injects the following snippets into your `package.json`:

```json5
"scripts": {
  "format": "prettier-standard 'src/**/*.js'",
  "precommit": "lint-staged",
  "lint": "standard"
},
...
"lint-staged": {
  "linters": {
    "src/**/*.js": [
      "prettier-standard",
      "git add"
    ]
  }
}
```

and installs the supporting, backing packages.  on conflict of existing scripts, `standard-damn-it` retains your existing code/configuration.

by default, this package uses `npm`, but if a `yarn.lock` file is found, `yarn` will be used to install dependencies.

## usage

`npx standard-damn-it <src-glob>`

- `src-glob`, default: `src/**/*.js`
