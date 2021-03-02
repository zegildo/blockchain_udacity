var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
//var Test = require('../config/testConfig.js');
//var BigNumber = require('bignumber.js');

contract('Oracles', async (accounts) => {

  const TEST_ORACLES_COUNT = 20;
  //var config;
  before('setup contract', async () => {
    //config = await Test.Config(accounts);
    console.log(accounts);
    console.log("length: " + accounts.length);

    
    // Watch contract events
    const STATUS_CODE_UNKNOWN = 0;
    const STATUS_CODE_ON_TIME = 10;
    const STATUS_CODE_LATE_AIRLINE = 20;
    const STATUS_CODE_LATE_WEATHER = 30;
    const STATUS_CODE_LATE_TECHNICAL = 40;
    const STATUS_CODE_LATE_OTHER = 50;

  });


  it('can register oracles', async () => {
    
    let instanceApp = await FlightSuretyApp.deployed();
    let owner = accounts[0];
    
    let fee = await instanceApp.REGISTRATION_FEE.call();
    
    for(let a=1; a<=TEST_ORACLES_COUNT; a++) {
      
      await instanceApp.registerOracle({from:accounts[a], value: fee });
      let result = await instanceApp.getMyIndexes.call({from:accounts[a]});
      console.log(`${a} - Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`);
    }

    let oracle_1_detail = await instanceApp.getOracleInfo(accounts[1], {from:owner});
    assert.equal(oracle_1_detail[0], true);
    
    let oracle_20_detail = await instanceApp.getOracleInfo(accounts[20], {from:owner});
    assert.equal(oracle_20_detail[0], true);
  });

  it('can request flight status', async () => {
    
      let instanceApp = await FlightSuretyApp.deployed();
      let flight = 'AA 1122'; // flight code
      let dateString = "2020-11-11T11:11:00Z"
      let timestamp = new Date(dateString).getTime();
      let owner = accounts[0];
      
      await instanceApp.fetchFlightStatus(owner, flight, timestamp);

      var numResponses = 0;
      for(let a=1; a<=TEST_ORACLES_COUNT; a++) {
      
        let oracleIndexes = await instanceApp.getMyIndexes.call({ from: accounts[a]});

        try {
      
          await instanceApp.submitOracleResponse(oracleIndexes[0], owner, flight, timestamp, STATUS_CODE_ON_TIME, { from: accounts[a] });
          numResponses+=1;
    
          } catch(e) {
    
            console.log(`\nOracle no. ${a} not chosen`, 0, oracleIndexes[0].toNumber(), flight, timestamp);
          }
    }
    console.log("Num valid responses: ", numResponses)
    if (numResponses >= 3) {
       
        let flight_hash = await instanceApp.getFlightKey(owner, flight, timestamp);
        let flightInfo = await instanceApp.getFlight(flight_hash);
        console.log("Flight code: ", flightInfo[0]);
        console.log("Status code: ", Number(flightInfo[3]));
        assert.equal(flightInfo[0], "AA 1122");
        assert.equal(flightInfo[3], STATUS_CODE_ON_TIME);
    }


  });


 
});
