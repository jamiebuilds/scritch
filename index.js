'use strict'
let path = require('path')
let fs = require('fs')
let meow = require('meow')
let { promisify } = require('util')
let executable = require('executable')
let crossSpawn = require('cross-spawn')
let readPkgUp = require('read-pkg-up')
let stripIndent = require('strip-indent')

let readdir = promisify(fs.readdir)
let stat = promisify(fs.stat)

function isPlainObject(val) {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}

// Prevent caching of this module so module.parent is always accurate
delete require.cache[__filename];
let parentDir = path.dirname(module.parent.filename)

async function scritch(dir, opts = {}) {
  let scriptsPath = opts.scriptsPath || 'scripts'
  let env = opts.env || {}
  let helpContent = opts.help

  let scriptsDir = path.resolve(dir, scriptsPath)

  // Lookup scripts
  let dirents = await readdir(scriptsDir, { withFileTypes: true })
  let scripts = []

  for (let dirent of dirents) {
    // Ignore directories
    if (dirent.isDirectory()) {
      continue
    }

    // Ignore scripts that start with `_` (treated like helpers)
    if (dirent.name.startsWith('_')) {
      continue
    }

    // Get base name (without extension) and path of file
    let name = path.basename(dirent.name, path.extname(dirent.name))
    let filePath = path.join(scriptsDir, dirent.name)

    // Ensure file is executable
    if (!await executable(filePath)) {
      throw new Error(`Expected path to be executable: "${filePath}"`)
    }

    scripts.push({ name, filePath })
  }

  // Store raw argv
  let argv = process.argv.slice(2)

  // Lookup package for CLI
  let foundPkg = readPkgUp.sync({
    cwd: parentDir,
    normalize: false,
  })

  let pkg = foundPkg.pkg || {}
  let pkgPath = foundPkg.path

  let pkgRootPath = path.dirname(pkgPath)
  let pkgNodeModulesBinPath = path.join(pkgRootPath, 'node_modules', '.bin')

  // Extract bin name
  let binName;
  if (isPlainObject(pkg.bin)) {
    binName = Object.keys(pkg.bin)[0]
  } else if (pkg.name) {
    binName = pkg.name
  }
  if (!binName) binName = 'cli'

  // Create help content
  let help = ''
  help += `Usage\n`
  help += `  $ ${binName} <script> [...args]\n`
  help += '\n'
  help += `Scripts\n`
  help += scripts.map(script => `  - ${script.name}`).join('\n') + '\n'
  if (helpContent) {
    help += stripIndent(helpContent).trimRight()
  }

  let cli = meow({ argv, pkg, help })

  // Match script being run
  let scriptName = cli.input[0]
  let script = scripts.find(script => {
    return script.name === scriptName
  })

  // Show help if no script passed
  if (!script) {
    cli.showHelp()
    return
  }

  return new Promise(async (resolve, reject) => {
    // Spawn matching script
    let proc = crossSpawn(script.filePath, argv, {
      cwd: process.cwd(),
      shell: true,
      stdio: 'inherit',
      env: Object.assign({}, process.env, {
        PATH: `${pkgNodeModulesBinPath}:${scriptsDir}:${process.env.PATH}`,
        SCRITCH_SCRIPT_NAME: script.name,
        SCRITCH_SCRIPT_PATH: script.filePath,
        SCRITCH_SCRIPTS_DIR: scriptsDir,
      }, env),
    })

    proc.on('error', err => {
      reject(err);
    });

    proc.on('close', code => {
      if (code !== 0) {
        process.exitCode = code;
      }
      resolve();
    });
  });
}

module.exports = scritch
