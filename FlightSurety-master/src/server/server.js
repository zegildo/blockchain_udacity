import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';


let config = Config['localhost'];
//console.log("config:", config);
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
//console.log("web3 - accounts", web3.eth.accounts[0]);
//web3.eth.defaultAccount = web3.eth.accounts[0];
//console.log("The defaultaccount:",web3.eth.defaultAccount);
//console.log("url:", web3.eth.accounts.url);
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
//console.log("flightSuretyApp:",flightSuretyApp);

flightSuretyApp.events.OracleRequest({
    fromBlock: 0
  }, function (error, event) {
    if (error) console.log(error)
    console.log(event)
});

const app = express();
app.get('/api', (req, res) => {
    res.send({
      message: 'An API for use with your Dapp!'
    })
})

export default app;


