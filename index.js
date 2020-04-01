const acorn = require("acorn")
// jquery/esprima
const esprima = require('esprima')
const estraverse = require('estraverse')
const escodegen = require('escodegen')

const fs = require('fs')
const chalk = require('chalk')

const divideLine = function () {
  console.log(chalk.bold.green('--------------------------------------------------------------------'))
}
const log = function () {
  const mark = arguments[0]
  const args = [].slice.call(arguments, 1)
  divideLine()
  console.log(chalk.bold.green(mark + ':'))
  console.log(...args)
  divideLine()
}

let routerCodes = fs.readFileSync('./myapp/src/router/index.js')
routerCodes = routerCodes.toString()
// console.log('router: \r\n', routerCodes)

let ast
// 1
// try {
//   ast = acorn.parse(routerCodes, {
//     sourceType: 'module',
//   })
// } catch (err) {
//   console.log('err', err)
// }

// 2
ast = esprima.parse(routerCodes, {sourceType: 'module'})
log('Origin AST', ast)

// tokenize
// log(
//   'lexical analysis',
//   esprima.tokenize(routerCodes)
// )
// return

// 方法名称替换
const currentName = 'test'
const targetName = 'testNew'
estraverse.traverse(ast, {
  enter(node) {
    const { type } = node
    console.log('enter', type)
    if (type === 'FunctionDeclaration') {
      const name = node.id.name
      if (name === currentName) {
        node.id.name = targetName
      }
    } else if (type === 'ExpressionStatement') {
      const { expression } = node
      if (
        expression.type === 'CallExpression'
        && expression.callee.type === 'Identifier'
        && expression.callee.name === currentName
      ) {
        expression.callee.name = targetName
      }
    }
  },
  // leave(node) {
  //   // console.log('leave', node.type)
  //   if (node.type === 'FunctionDeclaration') {
  //     log('Leave function', node.id.name)
  //   }
  // },
})
log('After traverse AST', ast)


const resultCode = escodegen.generate(ast)
// log('ResultCode', resultCode)

fs.writeFileSync('./myapp/src/router/index_new.js', resultCode)
