const Contract = require('./index')
const abi  = require('../mocks/abi.json')
const rpc = require('../mocks/rpc')

test('Constructor', () => {
    var contract = new Contract(abi, '0x0000')
    contract.setRPC(new rpc())
    expect(contract.name(true)['0']).toBe('DePocket Token')
});