var HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic = "clutch neither faint ocean jump spice cheese despair bag monkey yellow gloom";

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