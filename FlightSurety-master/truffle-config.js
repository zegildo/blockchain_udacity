var HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic = "ancient note swift reject elbow escape ozone era much egg bulk rocket";

module.exports = {
  networks: {
    "oracle": {
      accounts: 22,
      defaultEtherBalance: 500,
      blockTime: 3,
      host:"localhost",
      port:8545,
      network_id: '*'
    },
    "flight": {
      provider: function() {
        return new HDWalletProvider(mnemonic, "ws://127.0.0.1:7545/");
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