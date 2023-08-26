const Contract = require('./index')
const abi = require('ethjs-abi');
const erc20abi  = require('../mocks/abi.json')
const rpc = require('../mocks/rpc')

test('Constructor', () => {
    var contract = new Contract(erc20abi, '0x0000')
    contract.setRPC(new rpc())
    expect(contract.name(true)['0']).toBe('DePocket Token')
});

test('decodeTransactionInput', () => {
    var contract = new Contract(erc20abi, '0x0000')
    var input = '0xa9059cbb000000000000000000000000c040f49d9adfced362fcd30240a883646da440400000000000000000000000000000000000000000000000004563918244f40000'
    
    var result = contract.decodeTransactionInput(input)
    console.log(result.amount.toString(10))
});