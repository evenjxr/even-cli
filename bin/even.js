#!/usr/bin/env node

const program = require('commander')
const inquirer = require('inquirer');


program
    .version(require('../package').version)
    .usage('<command> [options]')


program
    .command('create <app-name>')
    .description('create a new project powered by even-cli')
    .option('-e, --engine <engineName>', 'vue or react')
    .option('-f, --force', 'Overwrite target directory if it exists')
    .action(async (name, cmd) => {
        const options = cleanArgs(cmd)
        if (!options.engine) {
            const question = {
                name: "engine",
                type: 'list',
                message: "请选择框架",
                choices: ['vue', 'react'],
            }
            const res = await inquirer.prompt(question)
            options.engine = res.engine
        }
        require('../lib/create')(name, options)
    })



program
    .command('init <app-name>')
    .description('init a new project powered by even-cli')
    .option('-e, --engine <engineName>', 'vue or react')
    .option('-f, --force', 'Overwrite target directory if it exists')
    .action(async (name, cmd) => {
        const options = cleanArgs(cmd)
        if (!options.engine) {
            const question = {
                name: "engine",
                type: 'list',
                message: "请选择框架",
                choices: ['vue', 'react'],
            }
            const res = await inquirer.prompt(question)
            options.engine = res.engine
        }
        require('../lib/create')(name, options)
    })



program.parse(process.argv)

function camelize (str) {
    return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
  }

function cleanArgs (cmd) {
    const args = {}
    cmd.options.forEach(o => {
      const key = camelize(o.long.replace(/^--/, ''))
      if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
        args[key] = cmd[key]
      }
    })
    return args
}