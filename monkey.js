const fs = require('fs')
// parser
const esprima = require('esprima')
const estraverse = require('estraverse')
const escodegen = require('escodegen')
const chalk = require('chalk')

module.exports = class Monkey {

  constructor(url, option = { sourceType: 'module' }) {
    this.url = url
    this.option = option
    // this.sourceCode = ''
    this.ast = null
  }

  read(option = { sourceType: 'module' }) {
    let sourceCode = fs.readFileSync(this.url)
    sourceCode = sourceCode.toString()
    this._parse(sourceCode, option)
  }

  _parse(sourceCode, option) {
    this.ast = esprima.parse(sourceCode, Object.assign(this.option, option))
  }

  renameFunction(oldName, newName) {
    estraverse.traverse(this.ast, {
      enter(node) {
        const { type } = node
        if (type === 'FunctionDeclaration') {
          const name = node.id.name
          if (name === oldName) {
            node.id.name = newName
          }
        } else if (type === 'ExpressionStatement') {
          const { expression } = node
          if (
            expression.type === 'CallExpression'
            && expression.callee.type === 'Identifier'
            && expression.callee.name === oldName
          ) {
            expression.callee.name = newName
          }
        }
      },
    })
  }

  teach(option) {
    estraverse.traverse(this.ast, option)
  }

  work() {
    const code = escodegen.generate(this.ast)
    fs.writeFileSync(this.url, code)
    console.log(chalk.green('Monkey\'s work finished!'))
  }

}
