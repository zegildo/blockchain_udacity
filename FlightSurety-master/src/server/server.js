import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';

let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);

const AMOUNT_ORACLES = 22;
var oracles = [];
const registration_fee = web3.utils.toWei("1", "ether");

web3.eth.getAccounts().then(accounts => {
  
  if(accounts.length < AMOUNT_ORACLES) {
    console.log('Error... We need al least'+ AMOUNT_ORACLES + '!');
    return;
  }
  
  let start = accounts.length - AMOUNT_ORACLES - 1;
  let end = start + AMOUNT_ORACLES;
  console.log('Amount Accounts: '+accounts.length);
  
  for(var a = start; a < end; a++){
      let account = accounts[a];
      oracles.push(account);
      
      flightSuretyApp.methods.registerOracle().send({
            "from": account,
            "value": registration_fee,
            "gas": 4712388,
            "gasPrice": 100000000000
      }).then(result => {
          console.log('Registered: '+account);
      }).catch(err => {
          console.log('Could not create oracle at address: '+account+'\n\tbecause: '+err);
      })
    } //end for loop

  });

flightSuretyApp.events.OracleRequest(
  {
    fromBlock: 0
  }, 
  function (error, event){
    if (error){
      console.log(error);

    }else{

      let event_values = event['returnValues'];
      console.log(event_values);
      let index = event_values['index'];
      let airline = event_values['airline'];
      let flight = event_values['flight'];
      let timestamp = event_values['timestamp'];
      let status = Math.floor(Math.random() * 6) * 10;

      oracles.forEach(oracle => {

        flightSuretyApp.methods.getMyIndexes().call({
              "from": oracle,
              "gas": 4712388,
              "gasPrice": 100000000000
            }).then(result => {

              if(result[0]==index || result[1]==index || result[2]==index){        
                flightSuretyApp.methods
                .submitOracleResponse(index, airline, flight, timestamp, status).send({
                  "from": oracle,
                  "gas": 4712388,
                  "gasPrice": 100000000000
                }).then(result => {
                  console.log('Oracle ['+oracle+'] response submitted successfully.') 
                }).catch(error=>{
                  console.log('Could not submit oracle response because: '+error)
                });//end submitOracleResponse*/
              }

            }).catch(error => {
              console.log('Oracle indices error: '+error);
            })
      }); 
    }
  });

const app = express();
app.get('/api', (req, res) => {
    res.send({
      message: 'An API for use with your Dapp!'
    })
})

export default app;


