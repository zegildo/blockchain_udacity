var HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic = "clump economy limit owner kitten despair tongue frost exercise curious anchor age";

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
  //}//,
 // compilers: {
  //  solc: {
 //     version: "^0.4.25"
 //   }
  }
};