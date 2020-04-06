const babel = require('@babel/core')
const types = require('@babel/types')
const fs = require('fs')
const { log } = require('./utils')

function readMain() {
  const mainPath = './myapp/src/main.js'
  const src = fs.readFileSync(mainPath).toString()
  log('main', src)

  const routerPath = findRouterPath(src)
}

function findRouterPath(src) {
  // const ast = babel.parse(src)
  // log('main ast', ast)
  const result = babel.transform(src, {
    plugins: [
      {
        visitor: {
          ExpressionStatement(path, {opts}) {
            // console.log('path', path)
            const { node } = path
            // types 比较的是 node 节点
            if (!types.isCallExpression(node.expression)) return

            if (!types.isMemberExpression(node.expression.callee)) return

            if (!types.isNewExpression(node.expression.callee.object)) return

            if (!types.isIdentifier(node.expression.callee.object.callee)) return

            if (node.expression.callee.object.callee.name !== 'Vue') return

            node.expression.callee.object.arguments[0].properties.forEach(n => {
              if (n.value.name === 'router') {
                // 找到了 router，router 变量在哪里？
                // todo：找变量名是什么
                log('找到了 router', n)
              }
            })
            // const specifiers = path.node.specifiers
            // const source = path.node.source
            //
            // // 判断传入的配置参数是否是数组形式
            // if (Array.isArray(opts)) {
            //   opts.forEach(opt => {
            //     assert(opt.libraryName, 'libraryName should be provided')
            //   })
            //   if (!opts.find(opt => opt.libraryName === source.value)) return
            // } else {
            //   assert(opts.libraryName, 'libraryName should be provided')
            //   if (opts.libraryName !== source.value) return
            // }
            //
            // const opt = Array.isArray(opts) ? opts.find(opt => opt.libraryName === source.value) : opts
            // opt.camel2UnderlineComponentName = typeof opt.camel2UnderlineComponentName === 'undefined'
            //   ? false
            //   : opt.camel2UnderlineComponentName
            // opt.camel2DashComponentName = typeof opt.camel2DashComponentName === 'undefined'
            //   ? false
            //   : opt.camel2DashComponentName
            // // ImportDefaultSpecifier import xx from 'xx'
            // // ImportNamespaceSpecifier import * as xx from 'xx'
            // if (!types.isImportDefaultSpecifier(specifiers[0]) && !types.isImportNamespaceSpecifier(specifiers[0])) {
            //   // 遍历specifiers生成转换后的ImportDeclaration节点数组
            //   const declarations = specifiers.map((specifier) => {
            //     // 转换组件名称
            //     const transformedSourceName = opt.camel2UnderlineComponentName
            //       ? camel2Underline(specifier.imported.name)
            //       : opt.camel2DashComponentName
            //         ? camel2Dash(specifier.imported.name)
            //         : specifier.imported.name
            //     // 利用自定义的customSourceFunc生成绝对路径，然后创建新的ImportDeclaration节点
            //     return types.ImportDeclaration([types.ImportDefaultSpecifier(specifier.local)],
            //       types.StringLiteral(opt.customSourceFunc(transformedSourceName)))
            //   })
            //   // 将当前节点替换成新建的ImportDeclaration节点组
            //   path.replaceWithMultiple(declarations)
            // }
          }
        }
      }
    ]
  })
  log('result', result.code)
}

readMain()
