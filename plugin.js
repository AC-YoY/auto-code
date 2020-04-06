/*
* 尝试写一个 babel plugin demo
* */
const babel = require('@babel/core')
// const parser = require('@babel/parser')
// const traverse = require('@babel/traverse')
const types = require('@babel/types')
const assert = require('assert')

function camel2Underline(_str) {
  const str = _str[0].toLowerCase() + _str.substr(1)
  return str.replace(/([A-Z])/g, $1 => `_${$1.toLowerCase()}`)
}

function camel2Dash(_str) {
  const str = _str[0].toLowerCase() + _str.substr(1)
  return str.replace(/([A-Z])/g, ($1) => `-${$1.toLowerCase()}`)
}

const createVisitor = ({types}) => ({
  visitor: {
    ImportDeclaration(path, {opts}) {
      const specifiers = path.node.specifiers
      const source = path.node.source

      // 判断传入的配置参数是否是数组形式
      if (Array.isArray(opts)) {
        opts.forEach(opt => {
          assert(opt.libraryName, 'libraryName should be provided')
        })
        if (!opts.find(opt => opt.libraryName === source.value)) return
      } else {
        assert(opts.libraryName, 'libraryName should be provided')
        if (opts.libraryName !== source.value) return
      }

      const opt = Array.isArray(opts) ? opts.find(opt => opt.libraryName === source.value) : opts
      opt.camel2UnderlineComponentName = typeof opt.camel2UnderlineComponentName === 'undefined'
        ? false
        : opt.camel2UnderlineComponentName
      opt.camel2DashComponentName = typeof opt.camel2DashComponentName === 'undefined'
        ? false
        : opt.camel2DashComponentName

      if (!types.isImportDefaultSpecifier(specifiers[0]) && !types.isImportNamespaceSpecifier(specifiers[0])) {
        // 遍历specifiers生成转换后的ImportDeclaration节点数组
        const declarations = specifiers.map((specifier) => {
          // 转换组件名称
          const transformedSourceName = opt.camel2UnderlineComponentName
            ? camel2Underline(specifier.imported.name)
            : opt.camel2DashComponentName
              ? camel2Dash(specifier.imported.name)
              : specifier.imported.name
          // 利用自定义的customSourceFunc生成绝对路径，然后创建新的ImportDeclaration节点
          return types.ImportDeclaration([types.ImportDefaultSpecifier(specifier.local)],
            types.StringLiteral(opt.customSourceFunc(transformedSourceName)))
        })
        // 将当前节点替换成新建的ImportDeclaration节点组
        path.replaceWithMultiple(declarations)
      }
    }
  }
})

const visitor = createVisitor({types})

const code = `
    import { Select as MySelect, Pagination } from 'xxx-ui'
    import * as UI from 'xxx-ui'
`

const result = babel.transform(code, {
  plugins: [
    [
      visitor,
      {
        "libraryName": "xxx-ui",
        "camel2DashComponentName": true,
        "customSourceFunc": componentName => (`./xxx-ui/src/components/ui-base/${componentName}/${componentName}`),
      }
    ]
  ]
})

console.log(result.code)
// import MySelect from './xxx-ui/src/components/ui-base/select/select'
// import Pagination from './xxx-ui/src/components/ui-base/pagination/pagination'
// import * as UI from 'xxx-ui'
