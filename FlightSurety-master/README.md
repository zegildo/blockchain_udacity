# How to test this code

Here I present some information on how to set up the execution environment to test this project.

Versions:
* Truffle v5.1.66 (core: 5.1.66)
* Solidity - ^0.4.24 (solc-js)
* Node v12.16.3
* Web3.js v1.2.9

# Truffle test

## Ganache

Configure ganache GUI:

1) Create an workspace:


2) Configure it creating more than 20 accounts. It is necessary to pass on the rubric request.
![alt text](https://github.com/zegildo/blockchain_udacity/blob/main/FlightSurety-master/images/morethan20.JPG?raw=true)


3) Copy mnemonic to paste in the truffle-config.js:


4) Keep Ganache opened and alive during the execution!




## Truffle-config.js

Change the mnemonic sequence to your ganache sequence.


## Truffle test

Execute:

`truffle test --network develop`

Please, don't execute just `truffle test` the default **test** is not able to fulfill all the requirements of this project.

It is everything ok like that:



# DAPP



# FlightSurety

FlightSurety is a sample application project for Udacity's Blockchain course.

## Install

This repository contains Smart Contract code in Solidity (using Truffle), tests (also using Truffle), dApp scaffolding (using HTML, CSS and JS) and server app scaffolding.

To install, download or clone the repo, then:

`npm install`
`truffle compile`

## Develop Client

To run truffle tests:

`truffle test ./test/flightSurety.js`
`truffle test ./test/oracles.js`

To use the dapp:

`truffle migrate`
`npm run dapp`

To view dapp:

`http://localhost:8000`

## Develop Server

`npm run server`
`truffle test ./test/oracles.js`

## Deploy

To build dapp for prod:
`npm run dapp:prod`

Deploy the contents of the ./dapp folder


## Resources

* [How does Ethereum work anyway?](https://medium.com/@preethikasireddy/how-does-ethereum-work-anyway-22d1df506369)
* [BIP39 Mnemonic Generator](https://iancoleman.io/bip39/)
* [Truffle Framework](http://truffleframework.com/)
* [Ganache Local Blockchain](http://truffleframework.com/ganache/)
* [Remix Solidity IDE](https://remix.ethereum.org/)
* [Solidity Language Reference](http://solidity.readthedocs.io/en/v0.4.24/)
* [Ethereum Blockchain Explorer](https://etherscan.io/)
* [Web3Js Reference](https://github.com/ethereum/wiki/wiki/JavaScript-API)