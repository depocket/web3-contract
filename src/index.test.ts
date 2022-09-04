const Contract = require('./index')
const abi  = require('../mocks/abi.json')

test('Constructor', () => {
    var contract = new Contract(abi, '0x0000')
    console.log(contract)
    console.log(contract.name())
});