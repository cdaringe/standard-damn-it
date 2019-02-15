#! /usr/bin/env node
var cli = require('meow')(
  `
    instantly setup standardjs formatting into your project via prettier-standard.
      setup commit hooks to autoformat committed code with husky & lint-staged.

    Usage
      $ standard-damn-it

    Options
      --glob <glob>, -g

    Examples
      $ standard-damn-it
      $ standard-damn-it --glob '{src,test,scripts}/**/*.{js,jsx,ts,tsx}'
`,
  {
    flags: {
      glob: {
        type: 'string',
        alias: 'g',
        default: '{src,test,scripts}/**/*.{js,jsx,ts,tsx}'
      }
    }
  }
)

if (cli.flags.h) {
  cli.showHelp()
} else {
  var damnit = require('./')
  damnit({
    srcGlob: cli.flags.glob
  })
}
