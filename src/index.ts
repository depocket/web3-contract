const abi = require('ethjs-abi');
import { Interface } from 'ethers';
import { default as utils } from './utils';

class Contract {
  address: string
  jsonAbi: Array<any>
  iFace: Interface
  signatureMethods: Map<string, any>
  RPC: any
  Logger: any

  setRPC(RPC: any) {
    this.RPC = RPC;
  }

  setLogger(logger: any) {
    this.Logger = logger;
  }

  constructor(jsonInterface: Array<any>, address: string){
    this.address = address;
    var self = this;
    if(!jsonInterface || !(Array.isArray(jsonInterface))) {
      throw new Error("Missing contract ABI");
    }
    this.jsonAbi = jsonInterface;
    this.iFace = new Interface(jsonInterface)
    const sigMap = new Map();
    jsonInterface.map(function(method) {
      method.constant = (method.stateMutability === "view" || method.stateMutability === "pure" || method.constant);
      method.payable = (method.stateMutability === "payable" || method.payable);
      if (method.type === 'function') {
        sigMap.set(abi.encodeSignature(method), method);
      }
      if (method.type === 'function' && method.constant) {
        method.signature = 'signature';
        self[method.name] = self.createContractFunction(method)
      } else if (method.type === 'event') {}
    })
    this.signatureMethods = sigMap
  }

  performCall({ methodObject, methodArgs }) {
    let queryMethod = 'call';
    let implicit = true
    if (typeof(methodArgs[0]) == 'boolean') {
      implicit = methodArgs.pop()
    }
    var res = this.RPC.Call(this.address, abi.encodeMethod(methodObject, methodArgs))
    if (queryMethod === 'call') {
      try {
        const decodedMethodResult = abi.decodeMethod(methodObject, res);
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

  extractMethodSignature(inputData: string) {
    const methodSignature = inputData.slice(0, 10);
    return methodSignature;
  }

  getMethodAbiBySignature(signature: string) {
    return this.signatureMethods.get(signature)
  }

  decodeTransactionInput(inputData: string) {
    const result = this.iFace.parseTransaction({ data: inputData });
    const method = this.getMethodAbiBySignature(this.extractMethodSignature(inputData));
    const inputNames = utils.getKeys(method?.inputs, 'name', true);
    const args = result?.args;
    var res = {
      name: result?.name,
      signature: result?.signature,
    }
    args?.forEach((element, index) => {
      res[inputNames[index]] = element
    });
    return res
  }

  decodeEvent(data: string, topics: string[]) {
    return abi.decodeEvent(this.jsonAbi, data, topics);
  }
}

module.exports = Contract;