import * as abi from 'ethjs-abi';
import { default as utils } from './utils';
const txObjectProperties = ['from', 'to', 'data', 'value', 'gasPrice', 'gas'];

function createContractFunction(methodObject) {
  return function contractFunction() {
    const methodArgs = [].slice.call(arguments);
    const promise = performCall({ methodObject, methodArgs });
    return promise;
  };
}

function hasTransactionObject(args) {
  if (!Array.isArray(args) || args.length === 0) {
    return false;
  }
  const lastArg = args[args.length - 1];
  if (!lastArg) return false;
  if (typeof lastArg !== 'object') {
    return false;
  }
  if (Object.keys(lastArg).length === 0) {
    return true;
  }
  const keys = Object.keys(lastArg);
  const hasMatchingKeys = txObjectProperties.some((value) => keys.includes(value));
  if (hasMatchingKeys) {
    return true;
  }
  return false;
}

function performCall({ methodObject, methodArgs }) {
  let queryMethod = 'call';
  let providedTxObject = {};

  if (hasTransactionObject(methodArgs)) providedTxObject = methodArgs.pop();
//   const methodTxObject = Object.assign({},
//     providedTxObject, {
//       to: '',
//     }, {
//         data: abi.encodeMethod(methodObject, methodArgs)
//     });

  if (methodObject.constant === false) {
    queryMethod = 'sendTransaction';
  }

  //const queryResult = self.query[queryMethod](methodTxObject);

  if (queryMethod === 'call') {
    // queryMethod is 'call', result is returned value
    try {
      const decodedMethodResult = abi.decodeMethod(methodObject, '');
      return decodedMethodResult;
    } catch (decodeFormattingError) {
      const decodingError = new Error(`[ethjs-contract] while formatting incoming raw call data ${JSON.stringify('')} ${decodeFormattingError}`);
      throw decodingError;
    }
  }
  // queryMethod is 'sendTransaction', result is txHash
  return 'ok';
}

export class Contract {
    address: string

    constructor(jsonInterface, address){
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
                // Todo: Need to implement signature
                method.signature = 'signature';
                self[method.name] = function() {
                    // if RPC && RPC.Call {
                    //     RPC.Call(self.address, '0x000')
                    // }
                  return 'call success'
                }//createContractFunction(method)
            } else if (method.type === 'event') {

            }
        })
    }
}