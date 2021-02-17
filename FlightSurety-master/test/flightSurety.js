
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
    //console.log(airline_details);
    
    assert.equal(airline_details[1], "Latam Airlines");
    assert.equal(airline_details[2], true);//isRegistered
    assert.equal(airline_details[3], false);//isFunded
  });

  it("(airline register) register 4 airlines directly", async() => {

    let airline_2 = accounts[1];
    let airline_3 = accounts[2];
    let airline_4 = accounts[3];
    let instanceApp = await config.flightSuretyApp;
    
    // first airline registers two consecutive airlines
    await instanceApp.registerAirline(airline_2, "Azul Airlines", {from:config.owner});
    
    try{
        await instanceApp.registerAirline(airline_2, "Azul Airlines", {from:config.owner});
    }catch(err){
        assert.equal(err.reason, "Airline is already registered");
    }

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
    assert.equal(airline_details_1[3], false);
    
    assert.equal(airline_details_2[1], "Azul Airlines");
    assert.equal(airline_details_2[2], true);
    assert.equal(airline_details_2[3], false);
    
    
    assert.equal(airline_details_3[1], "American Airlines");
    assert.equal(airline_details_3[2], true);
    assert.equal(airline_details_3[3], false);
    
    
    assert.equal(airline_details_4[1], "Arabian Airlines");
    assert.equal(airline_details_4[2], true);
    assert.equal(airline_details_4[3], false);
    
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
    assert.equal(airline_details[3], false);
});

it("(voting) register by multiparty consensus voting", async() => {
    
    let instanceApp = await config.flightSuretyApp;
    let num_airlines = await instanceApp.getNumAirlinesRegistred.call();
    
    let airline_2 = accounts[1];
    let airline_3 = accounts[2];
    let airline_4 = accounts[3];
    let airline_5 = accounts[4];

    //5th airline is not registered
    let airline_5_details = await instanceApp.getAirline.call(airline_5);
    assert.equal(airline_5_details[2], false);

    //2sd airline is already registered
    let airline_2_details = await instanceApp.getAirline.call(airline_2);
    assert.equal(airline_2_details[2], true);

    //airline_2 is already registered
    try{
        await instanceApp.vote(airline_2, {from: config.owner})
    }catch(err){
        assert.equal(err.reason,"Airline is already registered");
    }

    //1st airline is already registered
    let owner_details = await instanceApp.getAirline.call(config.owner);
    assert.equal(owner_details[2], true);

    try{
        await instanceApp.vote(airline_5, {from:config.owner});
    }catch(err){
        assert.equal(err.reason,"Airline does not participate in contract until it submits funding of 10 ether");
    }
    //now can vote because has paid the fund
    let ten_ether_fund = await web3.utils.toWei("10", "ether");
    await instanceApp.fund({from:config.owner, value:ten_ether_fund});
    
    await instanceApp.vote(airline_5, {from:config.owner});
    airline_5_details = await instanceApp.getAirline.call(airline_5);
    assert.equal(airline_5_details[2], false);
    assert.equal(airline_5_details[4].length, 1);

    try{
        await instanceApp.vote(airline_5, {from:config.owner});
    }catch(e){
        assert.equal(err.reason,"The Airline already voted!");
    }
    //IF MORE THE 50% REGISTER THE COMPANY
    await instanceApp.vote(airline_5, {from:airline_2});
    await instanceApp.vote(airline_5, {from:airline_3});

    airline_5_details = await instanceApp.getAirline.call(airline_5);
    // there are 5 airlines in the list
    assert.equal(num_airlines, 5);
    //3 of 5 (more than 50%)
    assert.equal(airline_5_details[4].length, 3);
    //isRegistered is true
    assert.equal(airline_5_details[2], true);
     
    

});
/*
it("(Flight) create a flight", async() => {
    
    //https://www.kwe.co.jp/en/useful-contents/code1

    let instanceApp = await config.flightSuretyApp;

    let flight_code = "AAL001";
    let origin = "Rio";
    let destination = "London";
    let date = "2020-06-09T12:00:00Z"
    let timestamp = new Date(date).getTime();

    await instanceApp.registerFlight(flight_code,origin,destination,timestamp,{from:config.owner});
    
    let flight_hash = await instanceApp.getFlightKey.call(config.owner, flight_code, timestamp);
    let flight_info = await instanceApp.getFlight.call(flight_hash);

    assert.equal(flight_info[0],flight_code);
    assert.equal(flight_info[1],origin);
    assert.equal(flight_info[2],destination);
    assert.equal(flight_info[3],timestamp);
    assert.equal(flight_info[4],true);
    assert.equal(flight_info[5],false);
    assert.equal(flight_info[6],0);
    assert.equal(flight_info[7],config.owner);    
});

it("(Flight) Update Status", async() => {
    
    let instanceApp = await config.flightSuretyApp;

    let flight_code = "AAL001";
    let date = "2020-06-09T12:00:00Z"
    let timestamp = new Date(date).getTime();
    console.log("timestamp:",timestamp);

    let flight_hash = await instanceApp.getFlightKey(config.owner, flight_code, timestamp);

    let STATUS_CODE_LATE_TECHNICAL = 40;
    await instanceApp.updateFlightStatus(flight_hash, STATUS_CODE_LATE_TECHNICAL);
    
    let flight_info = await instanceApp.getFlight.call(flight_hash);
    assert.equal(flight_info[6], STATUS_CODE_LATE_TECHNICAL);
});


it("(Buy an insure) ", async() => {

    let instanceApp = await config.flightSuretyApp;

    let flight_code = "AAL001";
    let date = "2020-06-09T12:00:00Z"
    let timestamp = new Date(date).getTime();

    let user_client = accounts[6];
    let zero_insure = await web3.utils.toWei("0", "ether");
    let one_ether_insure = await web3.utils.toWei("1", "ether");
    let ten_ether_fund = await web3.utils.toWei("10", "ether");

    //check if airline no fundind trying to paid
    try{
        await instanceApp.buy(config.owner, flight_code, timestamp, {from: user_client, value: zero_insure});
    }catch(err){
        assert.equal(err.reason,"Airline can not participate in contract until it submits funding of 10 ether");
    }

    let owner_details = await instanceApp.getAirline.call(config.owner);
    assert.equal(owner_details[2], true);
    assert.equal(owner_details[3], false);

    try{
        await instanceApp.fundFee({from:config.owner, value:ten_ether_fund});
    }catch(err){
        console.log(err);
    }

    owner_details = await instanceApp.getAirline.call(config.owner);
    console.log(owner_details);
    assert.equal(owner_details[3], true);


    //check if user has paid appropriate value
    try{
        await instanceApp.buy(config.owner, flight_code, timestamp, {from: user_client, value: zero_insure});
    }catch(err){
        assert.equal(err.reason,"It is not possible to accept this value of insure");
    }
    
    //verificar se o status do voo foi atualizado
    await instanceApp.buy(airline_address, fligh_code, timestamp, {from: user_client, value: one_ether_insure});
    let flight_hash = await instanceApp.getFlightKey(airline_address, fligh_code, timestamp);
    let flight_info = await instanceApp.getFlight.call(flight_hash);
    assert.equal(flight_info[5],true);

    //verificar se o valor enviado bate com o valor armazenado pela estrutura
    let insure_value = await instanceApp.getInsuredClient(flight_hash, {from:user_client});
    assert.equal(one_ether_insure, insure_value);

});

it("(Credit Insuree) ", async() => {
    let instanceApp = await config.flightSuretyApp;

    let flight_code = "AAL001";
    let origin = "Rio";
    let destination = "London";
    let date = "2020-06-09T12:00:00Z"
    let timestamp = new Date(date).getTime();

    await instanceApp.registerFlight(flight_code,origin,destination,timestamp,{from:config.owner});

    let flight_hash = await instanceApp.getFlightKey.call(config.owner, flight_code, timestamp);
   
    let user_client = accounts[6];
    let airline = config.owner;
    let statusCode = 20;
    
    await instanceApp.processFlightStatus(airline, flight_code, timestamp, statusCode, {from:user_client});
    let insure_value = await instanceApp.getInsuredClient(flight_hash, {from:user_client});
    let insure_due = await instanceApp.getInsuredDue(flight_hash, {from:user_client});
    assert.equal(insure_due, insure_value * 1.5);
});


it("(Pay Insuree) ", async() => {

    let instanceApp = await config.flightSuretyApp;

    let user_client = accounts[6];
    let value = await web3.utils.toWei("0.2", "ether");
    let airline = config.owner;
    let flight_code = "AAL001";
    let date = "2020-06-09T12:00:00Z"
    let timestamp = new Date(date).getTime();

    let flight_hash = await instanceApp.getFlightKey.call(airline, flight_code, timestamp);

    let user_balance_before = await web3.eth.getBalance(user_client);
    let insure_due_before = await instanceApp.getInsuredDue(flight_hash, {from:user_client});

    await instanceApp.pay(flight_hash, value, {from:user_client});

    let insure_due_after = await instanceApp.getInsuredDue(flight_hash, {from:user_client});
    let user_balance_after = await web3.eth.getBalance(user_client);

    assert.equal(insure_due_after + value, insure_due_before);
    assert.equal(user_balance_before + value, user_balance_after);

});

*/ 

});
