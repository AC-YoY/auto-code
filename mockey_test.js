const Monkey = require('./monkey-esprima')

const monkey = new Monkey('./myapp/src/router/index.js')
monkey.read()
monkey.renameFunction('test', 'fuckOff')
monkey.work()
