var HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic = "grief account winner flat drip kidney chest surprise loop program bench panic";

module.exports = {
  networks: {
    develop: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "http://localhost:7545",0,25);
      },
      websockets: true,
      network_id: '*'
      //gas: 9999999
    }
  },
  compilers: {
    solc: {
      version: "^0.4.24"   
    }
  }
};