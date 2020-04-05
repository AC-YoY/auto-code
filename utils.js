const chalk = require('chalk')
const util = require('util')

const divideLine = function () {
  console.log(chalk.bold.green('--------------------------------------------------------------------'))
}

const log = function () {
  const mark = arguments[0]
  const args = [].slice.call(arguments, 1)
  divideLine()
  console.log(chalk.bold.green(mark + ':'))
  console.log(util.inspect(...args, false, null))
  divideLine()
}

module.exports = {
  divideLine,
  log,
}
