var pkgUp = require('pkg-up')
var fs = require('fs-extra')
var path = require('path')
var execa = require('execa')
var TO_INSTALL_DEV_PACKAGES = ['prettier-standard', 'lint-staged', 'husky']

async function damnIt ({ srcGlob, packager }) {
  var packageFilename = await pkgUp()
  var root = path.dirname(packageFilename)
  var packagerArgs
  var isYarn
  if (!packager) isYarn = await fs.exists(path.join(root, 'yarn.lock'))
  packager = isYarn ? 'yarn' : 'npm'
  if (isYarn) {
    packagerArgs = ['add', '--dev']
  } else {
    packagerArgs = ['install', '--save-dev']
  }
  var injectLintStage = {
    'lint-staged': {
      linters: {
        [srcGlob]: ['prettier-standard', 'git add']
      }
    }
  }
  var injectScriptFormatKey = 'format'
  var injectScriptFormatValue = `prettier-standard '${srcGlob}'`

  var pkg
  try {
    pkg = require(packageFilename)
  } catch (err) {
    console.log(
      `[standard-damn-it] can't parse package.json :/ (${packageFilename})`
    )
    process.exit(1)
  }
  pkg.scripts = pkg.scripts || {}
  if (pkg.scripts[injectScriptFormatKey]) {
    console.warn(
      `[standard-damn-it] package already has "format" script. skipping.`
    )
  } else {
    pkg.scripts[injectScriptFormatKey] =
      pkg.scripts[injectScriptFormatKey] || injectScriptFormatValue
  }
  if (pkg.scripts.precommit) {
    if (!(pkg.scripts.precommit.match && pkg.scripts.precommit.match(/lint/))) {
      console.error(
        `[standard-damn-it] precommit hook already present, missing lint-staged`
      )
      process.exit(1)
    }
  } else {
    pkg.scripts.precommit = 'lint-staged'
  }
  if (pkg['lint-staged']) {
    console.warn(
      `[standard-damn-it] package already has "lint-staged". skipping.`
    )
  } else {
    Object.assign(pkg, injectLintStage)
  }
  await fs.writeFile(packageFilename, JSON.stringify(pkg, null, 2))
  await execa(packager, packagerArgs.concat(TO_INSTALL_DEV_PACKAGES), {
    cwd: root,
    stdio: 'inherit'
  })
}

module.exports = damnIt
