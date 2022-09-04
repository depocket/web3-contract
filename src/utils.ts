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

export default {
    jsonInterfaceMethodToString,
    flattenTypes
}