import * as abi from 'ethjs-abi';
import { default as utils } from './utils';

interface TransactionArgs {
  to: string,
  from?: string,
  data: any,
}

class Contract {
  address: string
  RPC: any

  setRPC(RPC: any) {
    this.RPC = RPC;
  }

  constructor(jsonInterface, address: string){
    this.address = address;
    var self = this;
    if(!jsonInterface || !(Array.isArray(jsonInterface))) {
      throw new Error("Missing contract ABI");
    }
    jsonInterface.map(function(method) {
      var funcName;
      method.constant = (method.stateMutability === "view" || method.stateMutability === "pure" || method.constant);
      method.payable = (method.stateMutability === "payable" || method.payable);
      if (method.name) {
        funcName = utils.jsonInterfaceMethodToString(method);
      }
      if (method.type === 'function' && method.constant) {
        method.signature = 'signature';
        self[method.name] = self.createContractFunction(method)
      } else if (method.type === 'event') {}
    })
  }

  performCall({ methodObject, methodArgs }) {
    let queryMethod = 'call';
    let implicit = true
    if (typeof(methodArgs[0]) == 'boolean') {
      implicit = methodArgs.pop()
    }

    var res = this.RPC.Call(this.address, abi.encodeMethod(methodObject, methodArgs))

    if (queryMethod === 'call') {
      // queryMethod is 'call', result is returned value
      try {
        const decodedMethodResult = abi.decodeMethod(methodObject, res);
        console.log(decodedMethodResult)
        return decodedMethodResult;
      } catch (decodeFormattingError) {
        const decodingError = new Error(`[ethjs-contract] while formatting incoming raw call data ${JSON.stringify(res)} ${decodeFormattingError}`);
        throw decodingError;
      }
    }
    return res;
  }

  createContractFunction(methodObject) {
    var self = this
    return function contractFunction() {
      const methodArgs = [].slice.call(arguments);
      const promise = self.performCall({ methodObject, methodArgs });
      return promise;
    };
  }
}

module.exports = Contract;