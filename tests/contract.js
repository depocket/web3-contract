const Contract = require('../src/index')
const abi = require('./abi.json')
var c = new Contract(abi, '0x00000')
console.log(c.name())
