// migrating the appropriate contracts
var Verifier = artifacts.require("./Verifier");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
var ERC721Mintable = artifacts.require("./CustomERC721Token");

module.exports = function(deployer) {
  deployer.deploy(ERC721Mintable);
  deployer.deploy(Verifier)
   .then(() => {
     return deployer.deploy(SolnSquareVerifier,Verifier.address);
   })
};