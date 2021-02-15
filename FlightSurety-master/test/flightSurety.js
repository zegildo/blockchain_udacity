
var Test = require('../config/testConfig.js');

contract('Flight Surety Tests', async (accounts) => {
    
  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);
    //await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`(multiparty) has correct initial isOperational() value`, async function () {

    // Get operating status
    let status = await config.flightSuretyData.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");

  });

  it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

      // Ensure that access is denied for non-Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
            
  });

  it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

      // Ensure that access is allowed for Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false);
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, false, "Access not restricted to Contract Owner");
      
  });

  it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

      await config.flightSuretyData.setOperatingStatus(false);

      let reverted = false;
      try 
      {
          await config.flightSurety.setTestingMode(true);
      }
      catch(e) {
          reverted = true;
      }
      assert.equal(reverted, true, "Access not blocked for requireIsOperational");      

      // Set it back for other tests to work
      await config.flightSuretyData.setOperatingStatus(true);

  });

  it("(airline register) registered the first airline after deployed contract", async() => {
    
    let instanceApp = await config.flightSuretyApp;
    let num_airlines = await instanceApp.getNumAirlinesRegistred.call();
    
    assert.equal(num_airlines, 1);
    
    let airline_details = await instanceApp.getAirline(config.owner);
    
    assert.equal(airline_details[1], "Latam Airlines");
    assert.equal(airline_details[2], true);
  });

  it("(airline register) register 4 airlines directly", async() => {

    let airline_2 = accounts[1];
    let airline_3 = accounts[2];
    let airline_4 = accounts[3];
    let instanceApp = await config.flightSuretyApp;
    
    // first airline registers two consecutive airlines
    await instanceApp.registerAirline(airline_2, "Azul Airlines", {from:config.owner});
    await instanceApp.registerAirline(airline_3, "American Airlines", {from:config.owner});
    let num_airlines = await instanceApp.getNumAirlinesRegistred.call();    
    assert.equal(num_airlines, 3);
    
    // fourth airline is registered by the unfunded third airline
    await instanceApp.registerAirline(airline_4, "Arabian Airlines", {from:airline_3});
    num_airlines = await instanceApp.getNumAirlinesRegistred.call();
    assert.equal(num_airlines, 4);

    //names registred
    let airline_details_1 = await instanceApp.getAirline(config.owner);
    let airline_details_2 = await instanceApp.getAirline(airline_2);
    let airline_details_3 = await instanceApp.getAirline(airline_3);
    let airline_details_4 = await instanceApp.getAirline(airline_4);

    assert.equal(airline_details_1[1], "Latam Airlines");
    assert.equal(airline_details_1[2], true);
    assert.equal(airline_details_2[1], "Azul Airlines");
    assert.equal(airline_details_2[2], true);
    assert.equal(airline_details_3[1], "American Airlines");
    assert.equal(airline_details_3[2], true);
    assert.equal(airline_details_4[1], "Arabian Airlines");
    assert.equal(airline_details_4[2], true);
    
});

it("(airline register) 5 airlines is added but Not-registered", async() => {
    let instanceApp = await config.flightSuretyApp;
    let airline_5 = accounts[4];
    await instanceApp.registerAirline(airline_5, "Jet Leg Arilines", {from:config.owner});
    let num_airlines = await instanceApp.getNumAirlinesRegistred.call();
   
    assert.equal(num_airlines, 5);
    
    let airline_details = await instanceApp.getAirline(airline_5);

    assert.equal(airline_details[1], "Jet Leg Arilines");
    assert.equal(airline_details[2], false);
});



it("(multiparty/airline register) register by multiparty consensus voting", async() => {
    
    let instanceApp = await config.flightSuretyApp;
    let num_airlines = await instanceApp.getNumAirlinesRegistred.call();
    
    // there are 5 airlines in the list
    assert.equal(num_airlines, 5);
    
    let airline_2 = accounts[1];
    let airline_3 = accounts[2];
    let airline_4 = accounts[3];
    let airline_5 = accounts[4];

    //5th airline is not registered
    let airline_5_details = await instanceApp.getAirline.call(airline_5);
    assert.equal(airline_5_details[2], false);

    //2th airline is already registered
    let airline_2_details = await instanceApp.getAirline.call(airline_2);
    assert.equal(airline_2_details[2], true);

    //airline_2 is already registered
    try{
        await instanceApp.vote(airline_2, {from: config.owner})
    }catch(err){
        assert.equal(err.reason,"Airline is already Registered");
    }
    let owner = await instanceApp.getAirline.call(config.owner);
    console.log("owner:", owner);
    console.log("airline_5_details:", airline_5_details);

    //airline_2 is already registered
    try{
        await instanceApp.vote(airline_5, {from: config.owner});
    }catch(err){
        assert.equal(err.reason,"Airline does not participate in contract until it submits funding of 10 ether");
    }

    await instanceApp.fund({from:airline_2, value:5});

});





 

});
