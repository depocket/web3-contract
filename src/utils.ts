const jsonInterfaceMethodToString = function (json) {
    if (!!json && typeof json === 'object' && json.name && json.name.indexOf('(') !== -1) {
        return json.name;
    }

    return json.name + '(' + flattenTypes(false, json.inputs).join(',') + ')';
};

const flattenTypes = function(includeTuple, puts)
{
    var types = Array<string>();

    puts.forEach(function(param) {
        if (typeof param.components === 'object') {
            if (param.type.substring(0, 5) !== 'tuple') {
                throw new Error('components found but type is not tuple; report on GitHub');
            }
            var suffix = '';
            var arrayBracket = param.type.indexOf('[');
            if (arrayBracket >= 0) { suffix = param.type.substring(arrayBracket); }
            var result = flattenTypes(includeTuple, param.components);
            if(Array.isArray(result) && includeTuple) {
                types.push('tuple(' + result.join(',') + ')' + suffix);
            }
            else if(!includeTuple) {
                types.push('(' + result.join(',') + ')' + suffix);
            }
            else {
                types.push('(' + result + ')');
            }
        } else {
            types.push(param.type);
        }
    });

    return types;
};

const isHexString = function(value, length=0) {
    if (typeof(value) !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
      return false;
    }
    if (length && value.length !== 2 + 2 * length) { return false; }
    return true;
}

function getKeys(params, key, allowEmpty) {
    var result: string[] = []; // eslint-disable-line
  
    if (!Array.isArray(params)) { throw new Error(`[ethjs-abi] while getting keys, invalid params value ${JSON.stringify(params)}`); }
  
    for (var i = 0; i < params.length; i++) { // eslint-disable-line
      var value = params[i][key];  // eslint-disable-line
      if (allowEmpty && !value) {
        value = '';
      } else if (typeof(value) !== 'string') {
        throw new Error('[ethjs-abi] while getKeys found invalid ABI data structure, type value not string');
      }
      result.push(value); // eslint-disable-line
    }
  
    return result;
}

function hexOrBuffer(valueInput, name) {
    var value = valueInput; // eslint-disable-line
    if (!Buffer.isBuffer(value)) {
      if (!isHexString(value)) {
        const error = new Error(name ? (`[ethjs-abi] invalid ${name}`) : '[ethjs-abi] invalid hex or buffer, must be a prefixed alphanumeric even length hex string');
        throw error;
      }
  
      value = value.substring(2);
      if (value.length % 2) { value = `0${value}`; }
      value = new Buffer(value, 'hex');
    }
  
    return value;
}
  

export default {
    jsonInterfaceMethodToString,
    flattenTypes,
    hexOrBuffer,
    getKeys
}