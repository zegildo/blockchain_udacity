var HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic = "crumble arrive ready faint maple canal universe wisdom just federal donkey neutral";

module.exports = {
  networks: {
    development: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:7545/");
      },
      network_id: '*'
      //gas: 9999999
    },

    develop: {
      host:"localhost",
      port:"7545",
      accounts: 20,
      defaultEtherBalance: 500,
      network_id: '*'    
    }
  },
  compilers: {
    solc: {
      version: "^0.4.25"
    }
  }
};