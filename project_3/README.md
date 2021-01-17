# Architect a Blockchain Supply Chain Solution - Part B

This repository containts an Ethereum DApp to Coffee Supply Chain.

## Project write-up - UML

* ![Activity Diagram](https://github.com/zegildo/blockchain_udacity/blob/main/project_3/UML/Activity-Diagram.pdf)
* ![Class Diagram](https://github.com/zegildo/blockchain_udacity/blob/main/project_3/UML/Class-Diagram.pdf)
* ![Sequence Diagram](https://github.com/zegildo/blockchain_udacity/blob/main/project_3/UML/Sequence-Diagram.pdf)
* ![State Diagram](https://github.com/zegildo/blockchain_udacity/blob/main/project_3/UML/State-Diagram.pdf)

### Project write-up - Libraries



```
Give examples (to be clarified)
```

### Project write-up - IPFS

### General Write Up

## Write smart contracts with functions

* ![SupplyChain.sol](https://github.com/zegildo/blockchain_udacity/blob/main/project_3/project/project-6/contracts/coffeebase/SupplyChain.sol)
* ![Ownable.sol](https://github.com/zegildo/blockchain_udacity/blob/main/project_3/project/project-6/contracts/coffeecore/Ownable.sol)
* ![ConsumerRole.sol](https://github.com/zegildo/blockchain_udacity/blob/main/project_3/project/project-6/contracts/coffeeaccesscontrol/ConsumerRole.sol)
* ![RetailerRole.sol](https://github.com/zegildo/blockchain_udacity/blob/main/project_3/project/project-6/contracts/coffeeaccesscontrol/RetailerRole.sol)
* ![DistributorRole.sol](https://github.com/zegildo/blockchain_udacity/blob/main/project_3/project/project-6/contracts/coffeeaccesscontrol/DistributorRole.sol)

## Test smart contract code coverage

## Deploy smart contract on a public test network (Rinkeby)

Transation ID: https://rinkeby.etherscan.io/tx/0x0174df580e5dfd8165a9053b4ea27d5cc4223397f2db50db08e1079c232bb452

Contract: https://rinkeby.etherscan.io/address/0x9d3cc5bcd31ce67089f53db88c46505526852f3b

## Modify client code to interact with a smart contract


Launch Ganache:

```
ganache-cli -m "spirit supply whale amount human item harsh scare congress discover talent hamster"
```

Your terminal should look something like this:

![truffle test](images/ganache-cli.png)

In a separate terminal window, Compile smart contracts:

```
truffle compile
```

Your terminal should look something like this:

![truffle test](images/truffle_compile.png)

This will create the smart contract artifacts in folder ```build\contracts```.

Migrate smart contracts to the locally running blockchain, ganache-cli:

```
truffle migrate
```

Your terminal should look something like this:

![truffle test](images/truffle_migrate.png)

Test smart contracts:

```
truffle test
```

All 10 tests should pass.

![truffle test](images/truffle_test.png)

In a separate terminal window, launch the DApp:

```
npm run dev
```

## Built With

* [Ethereum](https://www.ethereum.org/) - Ethereum is a decentralized platform that runs smart contracts
* [IPFS](https://ipfs.io/) - IPFS is the Distributed Web | A peer-to-peer hypermedia protocol
to make the web faster, safer, and more open.
* [Truffle Framework](http://truffleframework.com/) - Truffle is the most popular development framework for Ethereum with a mission to make your life a whole lot easier.


## Authors

See also the list of [contributors](https://github.com/your/project/contributors.md) who participated in this project.

## Acknowledgments

* Solidity
* Ganache-cli
* Truffle
* IPFS
