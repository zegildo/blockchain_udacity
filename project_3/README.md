# Architect a Blockchain Supply Chain Solution - Part B

This repository containts an Ethereum DApp to Coffee Supply Chain.

## Project write-up - UML

* [Activity Diagram](https://github.com/zegildo/blockchain_udacity/blob/main/project_3/UML/Activity-Diagram.pdf)
* [Class Diagram](https://github.com/zegildo/blockchain_udacity/blob/main/project_3/UML/Class-Diagram.pdf)
* [Sequence Diagram](https://github.com/zegildo/blockchain_udacity/blob/main/project_3/UML/Sequence-Diagram.pdf)
* [State Diagram](https://github.com/zegildo/blockchain_udacity/blob/main/project_3/UML/State-Diagram.pdf)

### Project write-up - Libraries

* [Truffle](https://www.trufflesuite.com/): Truffle was used on this project to create web structure, test and deploy it on local network and Rinkeby testnet. 
* [Infura](https://infura.io/): Infura was used on this project to connect our Dapp with Rinkeby network avoiding us of install all public ledger in our machines.
* [Metamask](https://metamask.io/):Metamask was used to connect truffle backend migrated with our interface in html/js.
* [Role](https://github.com/zegildo/blockchain_udacity/blob/main/project_3/project/project-6/contracts/coffeeaccesscontrol/Roles.sol): Role library was used to allow the access control in the functions developed in the supply chain design. 

### Project write-up - IPFS

### General Write Up

## Write smart contracts with functions

* [SupplyChain.sol](https://github.com/zegildo/blockchain_udacity/blob/main/project_3/project/project-6/contracts/coffeebase/SupplyChain.sol)
* [Ownable.sol](https://github.com/zegildo/blockchain_udacity/blob/main/project_3/project/project-6/contracts/coffeecore/Ownable.sol)
* [ConsumerRole.sol](https://github.com/zegildo/blockchain_udacity/blob/main/project_3/project/project-6/contracts/coffeeaccesscontrol/ConsumerRole.sol)
* [RetailerRole.sol](https://github.com/zegildo/blockchain_udacity/blob/main/project_3/project/project-6/contracts/coffeeaccesscontrol/RetailerRole.sol)
* [DistributorRole.sol](https://github.com/zegildo/blockchain_udacity/blob/main/project_3/project/project-6/contracts/coffeeaccesscontrol/DistributorRole.sol)

## Test smart contract code coverage
Testes can be found in [TestSupplychain.js](https://github.com/zegildo/blockchain_udacity/tree/main/project_3/project/project-6/test)

## Deploy smart contract on a public test network (Rinkeby)

Transation ID: https://rinkeby.etherscan.io/tx/0x0174df580e5dfd8165a9053b4ea27d5cc4223397f2db50db08e1079c232bb452

Contract: https://rinkeby.etherscan.io/address/0x9d3cc5bcd31ce67089f53db88c46505526852f3b

## Modify client code to interact with a smart contract



## Authors

zegildo@gmail.com

## Acknowledgments

Alvaro Andres P., my mentor in Udacity.
