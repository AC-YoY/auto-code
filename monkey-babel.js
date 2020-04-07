const babel = require('@babel/core')
const types = require('@babel/types')
const fs = require('fs')
const {log} = require('./utils')
const path = require('path')

const pwd = './myapp/src'

function readMain() {
  const mainPath = pwd + '/main.js'
  const src = fs.readFileSync(mainPath).toString()
  log('main', src)

  const routerPath = findRouterPath(src)
  log('路径', path.join(pwd, routerPath))
  readRouter(path.join(pwd, routerPath))
}

function findRouterPath(src) {
  // const ast = babel.parse(src)
  // log('main ast', ast)
  const variable2Path = {}
  let resultPath = ''

  const result = babel.transform(src, {
    plugins: [
      {
        visitor: {
          ImportDeclaration(path, {opts}) {
            const {node} = path
            if (!types.isImportDeclaration(node)) return

            node.specifiers.forEach(n => {
              if (types.isImportDefaultSpecifier(n)) {
                variable2Path[n.local.name] = node.source.value
              }
            })
          },
          ExpressionStatement(path, {opts}) {
            // console.log('path', path)
            const {node} = path
            // types 比较的是 node 节点
            if (!types.isCallExpression(node.expression)) return

            if (!types.isMemberExpression(node.expression.callee)) return

            if (!types.isNewExpression(node.expression.callee.object)) return

            if (!types.isIdentifier(node.expression.callee.object.callee)) return

            if (node.expression.callee.object.callee.name !== 'Vue') return

            node.expression.callee.object.arguments[0].properties.forEach(n => {
              if (n.key.name === 'router') {
                log('找到了 router', n.value.name)
                log('全部地址是:', variable2Path)
                log('地址是:', variable2Path[n.value.name])
                resultPath = variable2Path[n.value.name]
              }
            })
          }
        }
      }
    ]
  })
  log('result', result.code)
  return resultPath
}

function readRouter(path) {
  let file
  try {
    file = fs.readFileSync(path).toString()
    log('file1', file)
  } catch (e) {
    file = fs.readFileSync(path + '/index.js').toString()
    log('file2', file)
  }
  analysisRouter(file)
}

function analysisRouter(code) {
  const result = babel.transform(code, {
    plugins: [
      {
        visitor: {
          // 分析 new VueRouter
        }
      }
    ]
  })
}

readMain()
