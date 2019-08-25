var pkgUp = require('pkg-up')
var fs = require('fs-extra')
var path = require('path')
var execa = require('execa')

async function damnIt ({
  srcGlob,
  packager
}: {
  srcGlob: string
  packager: string
}) {
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
      [srcGlob]: [
        isYarn ? 'yarn format' : 'npm run format',
        isYarn ? 'yarn lint' : 'npm run lint',
        'git add'
      ]
    }
  }
  var injectScriptFormatKey = 'format'
  var injectScriptFormatValue = `prettier-standard '${srcGlob}'`

  var pkg: any = {}
  try {
    pkg = require(packageFilename)
  } catch (err) {
    console.log(
      `[standard-damn-it] can't parse package.json :/ (${packageFilename})`
    )
    process.exit(1)
  }
  var TO_INSTALL_DEV_PACKAGES = ['prettier-standard', 'lint-staged', 'husky']
  const combinedDeps = Object.assign({}, pkg.dependencies, pkg.devDependencies)
  var isTypescript = !!combinedDeps.typescript || combinedDeps['ts-node']
  const standardBinPkgName = isTypescript ? 'standardx' : 'standard'
  TO_INSTALL_DEV_PACKAGES.push(standardBinPkgName)
  pkg.scripts = pkg.scripts || {}
  if (pkg.scripts[injectScriptFormatKey]) {
    console.warn(
      `[standard-damn-it] package already has "format" script. skipping.`
    )
  } else {
    pkg.scripts[injectScriptFormatKey] =
      pkg.scripts[injectScriptFormatKey] || injectScriptFormatValue
  }
  if (pkg.scripts.lint) {
    console.warn(
      `[standard-damn-it] package already has "lint" script. skipping.`
    )
  } else {
    pkg.scripts.lint =
      pkg.scripts.lint || `${standardBinPkgName} '${srcGlob}' --fix`
  }
  if (pkg.husky) {
    if (
      !(
        pkg.husky.hooks['pre-commit'] &&
        pkg.husky.hooks['pre-commit'].match &&
        pkg.husky.hooks['pre-commit'].match(/lint/)
      )
    ) {
      console.error(
        `[standard-damn-it] pre-commit hook already present, missing lint-staged`
      )
      process.exit(1)
    }
  } else {
    pkg.husky = {
      ...{ hooks: { 'pre-commit': 'lint-staged' } },
      ...(pkg.husky || {})
    }
  }
  if (pkg['lint-staged']) {
    console.warn(
      `[standard-damn-it] package already has "lint-staged". skipping.`
    )
  } else {
    Object.assign(pkg, injectLintStage)
  }

  if (isTypescript) {
    console.log(
      '[standard-damn-it] adding no-unused-vars rule due to eslint-typescript parser bugs'
    )
    var eslintConfig = (pkg.eslintConfig = pkg.eslintConfig || {})
    var eslintConfigRules = (eslintConfig.rules = eslintConfig.rules || {})
    eslintConfigRules['no-unused-vars'] = 0
    var standardConfig = (pkg.standardx = pkg.standardx || {})
    var tsparser = '@typescript-eslint/parser'
    if (standardConfig.parser && standardConfig.parser !== tsparser) {
      console.warn(`ts project already has parser: ${standardConfig.parser}`)
    } else {
      standardConfig.parser = tsparser
      TO_INSTALL_DEV_PACKAGES.push(tsparser)
    }
    standardConfig.plugins = standardConfig.plugins || []
    standardConfig.plugins = standardConfig.plugins.filter(
      (key: string) => key !== '@typescript-eslint/eslint-plugin'
    )
    TO_INSTALL_DEV_PACKAGES.push('@typescript-eslint/eslint-plugin')
    standardConfig.plugins.push('@typescript-eslint/eslint-plugin')
    standardConfig.ignore = standardConfig.ignore || []
    standardConfig.ignore = standardConfig.ignore.filter(
      (key: string) => key !== '**/*.d.ts'
    )
    standardConfig.ignore.push('**/*.d.ts')
  }
  await fs.writeFile(packageFilename, JSON.stringify(pkg, null, 2))
  await execa(packager, packagerArgs.concat(TO_INSTALL_DEV_PACKAGES), {
    cwd: root,
    stdio: 'inherit'
  })
}

module.exports = damnIt
