const path = require('path')
const validateProjectName = require('validate-npm-package-name')
const ora = require('ora')
const fs = require('fs-extra')
const chalk = require('chalk')
const inquirer = require('inquirer')
const clear = require('clear-console');
const download = require('download-git-repo')


function gitclone(targetDir, options, callback) {
    download(`direct:https://github.com/evenjxr/${options.engine}-spa.git#master`, targetDir, { clone: true }, callback)
}

async function create (projectName, options) {
    const cwd = options.cwd || process.cwd()
    const inCurrent = projectName === '.'
    const name = inCurrent ? path.relative('../', cwd) : projectName
    const targetDir = path.resolve(cwd, projectName || '.')
    const result = validateProjectName(name)
    if (!result.validForNewPackages) {
      console.error(chalk.red(`Invalid project name: "${name}"`))
      result.errors && result.errors.forEach(err => {
        console.error(chalk.red.dim('Error: ' + err))
      })
      result.warnings && result.warnings.forEach(warn => {
        console.error(chalk.red.dim('Warning: ' + warn))
      })
      exit(1)
    }
    if (fs.existsSync(targetDir)) {
      if (options.force) {
        await fs.remove(targetDir)
      } else {
        await clear()
        if (inCurrent) {
          const { ok } = await inquirer.prompt([
            {
              name: 'ok',
              type: 'confirm',
              message: `Generate project in current directory?`
            }
          ])
          if (!ok) {
            return
          }
        } else {
          const { action } = await inquirer.prompt([
            {
              name: 'action',
              type: 'list',
              message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
              choices: [
                { name: 'Overwrite', value: 'overwrite' },
                { name: 'Cancel', value: false }
              ]
            }
          ])
          if (!action) {
            return
          } else if (action === 'overwrite') {
            console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
            await fs.remove(targetDir)
          }
        }
      }
    }
    const spinner = ora({
        color: 'green',
        text: '项目初始化中。。。'
    })
    spinner.start();
    gitclone(targetDir, options, (err) => {
        if (err) {
            spinner.fail(chalk.red(`😭   ${err}`))
            throw err;
        } else {
            spinner.succeed(chalk.green('😎   初始话成功'))
        }
    })
  }



module.exports = (...args) => {
    return create(...args).catch(err => {
        error(err)
        if (!process.env.VUE_CLI_TEST) {
            process.exit(1)
        }
    })
}