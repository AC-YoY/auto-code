// 1 acorn
const acorn = require("acorn")
// 2 jquery/esprima
const esprima = require('esprima')
const estraverse = require('estraverse')
const escodegen = require('escodegen')
// 3 @babel
const parse = require('@babel/parser')
const traverse = require('@babel/traverse')
const generator = require('@babel/generator')
// utils
const fs = require('fs')
const { log } = require('./utils')

const routerCodes = fs.readFileSync('./myapp/src/router/index.js').toString()
// console.log('router: \r\n', routerCodes)

let ast
// 1 acorn
// try {
//   ast = acorn.parse(routerCodes, {
//     sourceType: 'module',
//   })
//  log('Origin AST', ast)
// } catch (err) {
//   console.log('err', err)
// }


// 2 esprima
// ast = esprima.parse(routerCodes, {sourceType: 'module'})
// log('Origin AST', ast)
// // tokenize
// // log(
// //   'lexical analysis',
// //   esprima.tokenize(routerCodes)
// // )
// // return
// // 方法名称替换
// const currentName = 'test'
// const targetName = 'testNew'
// estraverse.traverse(ast, {
//   enter(node) {
//     const { type } = node
//     console.log('enter', type)
//     if (type === 'FunctionDeclaration') {
//       const name = node.id.name
//       if (name === currentName) {
//         node.id.name = targetName
//       }
//     } else if (type === 'ExpressionStatement') {
//       const { expression } = node
//       if (
//         expression.type === 'CallExpression'
//         && expression.callee.type === 'Identifier'
//         && expression.callee.name === currentName
//       ) {
//         expression.callee.name = targetName
//       }
//     }
//   },
//   // leave(node) {
//   //   // console.log('leave', node.type)
//   //   if (node.type === 'FunctionDeclaration') {
//   //     log('Leave function', node.id.name)
//   //   }
//   // },
// })
// log('After traverse AST', ast)

// 3 babel
ast = parse.parse(routerCodes, {sourceType: 'module'})
log('Origin AST', ast)


const resultCode = escodegen.generate(ast)
// log('ResultCode', resultCode)

fs.writeFileSync('./myapp/src/router/index_new.js', resultCode)
