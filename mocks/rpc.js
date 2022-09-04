class RPC {
    constructor(){
    }
    Call(){
        switch(arguments[1]){
            // Call Bep20.name()
            case '0x06fdde03':
                // Return `DePocket Token`
                return '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000e4465506f636b657420546f6b656e000000000000000000000000000000000000'
            default:
                return ''
        }
    }
};

module.exports = RPC;