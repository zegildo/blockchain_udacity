var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
//let flightSuretyData = FlightSuretyData.new();
//let flightSuretyApp = FlightSuretyApp.new(flightSuretyData.address);
var BigNumber = require('bignumber.js');

contract('Flight Surety Tests', async (accounts) => {
    
  //var config;
  before('setup contract', async () => {
    //config = await Test.Config(accounts);
    //await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it('(operational) has correct initial isOperational() value', async function () {
    // Get operating status
    let instanceData = await FlightSuretyData.deployed();
    let status = await instanceData.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");

  });

  it('(operational) can block access to setOperatingStatus() for non-Contract Owner account', async function () {

      let instanceApp = await FlightSuretyApp.deployed();
      // Ensure that access is denied for non-Contract Owner account
      let accessDenied = false;
      try 
      {
        await instanceApp.setOperatingStatus(false, { from:account[2] });
      }
      catch(e) {
        accessDenied = true;
      }
      assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
            
  });

  it('(operational) can allow access to setOperatingStatus() for Contract Owner account', async function () {

      let instanceApp = await FlightSuretyData.deployed();
      // Ensure that access is allowed for Contract Owner account
      let accessDenied = false;
      try 
      {
          await instanceApp.setOperatingStatus(false);
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, false, "Access not restricted to Contract Owner");
      
  });

  it('(operational) can block access to functions using requireIsOperational when operating status is false', async function () {

      let instanceApp = await FlightSuretyData.deployed();
      await instanceApp.setOperatingStatus(false);

      let reverted = false;
      try 
      {
          await flightSurety.setTestingMode(true);
      }
      catch(e) {
          reverted = true;
      }
      assert.equal(reverted, true, "Access not blocked for requireIsOperational");      

      // Set it back for other tests to work
      await instanceApp.setOperatingStatus(true);

  });

  it("(airline register) registered the first airline after deployed contract", async() => {
    let instanceApp = await FlightSuretyApp.deployed();
    let airline_1 = accounts[0];
    let num_airlines = await instanceApp.getNumAirlinesRegistred.call();
    
    assert.equal(num_airlines, 1);
   
    let airline_details = await instanceApp.getAirline.call(airline_1);
    
    assert.equal(airline_details[1], "Latam Airlines");
    assert.equal(airline_details[2], true);//isRegistered
    assert.equal(airline_details[3], false);//isFunded
  });
  
  it("(airline register) register the second airline", async() => {
    let airline_1 = accounts[0];
    let airline_2 = accounts[1];
    let instanceApp = await FlightSuretyApp.deployed();
    
    // first airline registers two consecutive airlines
    await instanceApp.registerAirline(airline_2, "Azul Airlines", {from:airline_1});
    let airline_2_details = await instanceApp.getAirline.call(airline_2);
    let num_airlines = await instanceApp.getNumAirlinesRegistred.call();
    
    assert.equal(num_airlines, 2);
    
    assert.equal(airline_2_details[1], "Azul Airlines");
    assert.equal(airline_2_details[2], true);//isRegistered
    assert.equal(airline_2_details[3], false);//isFunded
  });
/*
  it("(airline register) check Airline is already registered", async() => {
    let airline_1 = accounts[0];
    let airline_2 = accounts[1];
    let instanceApp = await FlightSuretyApp.deployed();

    let reverted = false;
    try{
        await instanceApp.registerAirline(airline_2, "Azul Airlines", {from:airline_1})
    }catch(err){
        reverted = true;
    }
     assert.equal(reverted, true, "Airline is already registered");
});*/

  it("(airline register) register 4 airlines directly", async() => {

    let airline_1 = accounts[0];
    let airline_2 = accounts[1];
    let airline_3 = accounts[2];
    let airline_4 = accounts[3];
    let instanceApp = await FlightSuretyApp.deployed();

    let num_airlines = await instanceApp.getNumAirlinesRegistred.call();    
    assert.equal(num_airlines, 2);

    await instanceApp.registerAirline(airline_3, "American Airlines", {from:airline_2});

    num_airlines = await instanceApp.getNumAirlinesRegistred.call();    
    assert.equal(num_airlines, 3);
    
    // fourth airline is registered by the unfunded third airline
    await instanceApp.registerAirline(airline_4, "Arabian Airlines", {from:airline_3});
    num_airlines = await instanceApp.getNumAirlinesRegistred.call();
    assert.equal(num_airlines, 4);

    //names registred
    let airline_details_1 = await instanceApp.getAirline.call(airline_1);
    let airline_details_2 = await instanceApp.getAirline.call(airline_2);
    let airline_details_3 = await instanceApp.getAirline.call(airline_3);
    let airline_details_4 = await instanceApp.getAirline.call(airline_4);

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
    let instanceApp = await FlightSuretyApp.deployed();
    let airline_2 = accounts[1];
    let airline_5 = accounts[4];
    await instanceApp.registerAirline(airline_5, "Jet Leg Arilines", {from:airline_2});
    let num_airlines = await instanceApp.getNumAirlinesRegistred.call();
   
    assert.equal(num_airlines, 5);
    
    let airline_details = await instanceApp.getAirline.call(airline_5);

    assert.equal(airline_details[1], "Jet Leg Arilines");
    assert.equal(airline_details[2], false);
    assert.equal(airline_details[3], false);
});

it("(airline register) 4 registered, 1 add none funded", async() => {
    
    let instanceApp = await FlightSuretyApp.deployed();
    let airline_1 = accounts[0];
    let airline_2 = accounts[1];
    let airline_3 = accounts[2];
    let airline_4 = accounts[3];
    let airline_5 = accounts[4];
    
    let airline_1_details = await instanceApp.getAirline(airline_1);
    let airline_2_details = await instanceApp.getAirline(airline_2);
    let airline_3_details = await instanceApp.getAirline(airline_3);
    let airline_4_details = await instanceApp.getAirline(airline_4);
    let airline_5_details = await instanceApp.getAirline(airline_5);
    
    assert.equal(airline_1_details[2], true);
    assert.equal(airline_2_details[2], true);
    assert.equal(airline_3_details[2], true);
    assert.equal(airline_4_details[2], true);
    assert.equal(airline_5_details[2], false);

});
it("(fund) Airline can fund", async() => {
    let instanceApp = await FlightSuretyApp.deployed();
    let airline_1 = accounts[0];
    let ten_ether_fund = await web3.utils.toWei("10", "ether");

    //let balance_App = await web3.eth.getBalance(config.flightSuretyApp.address);
    //let balance_Data = await web3.eth.getBalance(config.flightSuretyData.address);
    //console.log("balance_App_before:", balance_App);
    //console.log("balance_Data_before:", balance_Data);
    
    let airline_Balance_Before =  await web3.eth.getBalance(airline_1);
    //console.log("airline_2_Balance_Before:", airline_Balance_Before);

    
    //let address = instanceApp.address;
    await instanceApp.fundFee({from:airline_1, value:ten_ether_fund});
    //console.log("Address:",address);

    //balance_App = await web3.eth.getBalance(address);
    //balance_Data = await web3.eth.getBalance(config.flightSuretyData.address);
    //console.log("balance_App_after:", balance_App);
    //console.log("balance_Data_after:", balance_Data);
    
    let airline_Balance_After = await web3.utils.toWei(await web3.eth.getBalance(airline_1), "ether");
    airline_Balance_After = new BigNumber(airline_Balance_After)
    //console.log("airline_1_Balance_After:", airline_Balance_After);
    let restore_balance = new BigNumber(airline_Balance_After) + new BigNumber(ten_ether_fund);
    //console.log("restore:", restore_balance);
    assert.equal(restore_balance < airline_Balance_Before, true);

    let funded_airlines = await instanceApp.getNumAirlinesFunded.call();
    assert.equal(funded_airlines,1);

});
/*
it("(fund) No registered Airline can fund", async() => {
    
    let instanceApp = await FlightSuretyApp.deployed();
    let airline_5 = accounts[4];
    let ten_ether_fund = await web3.utils.toWei("10", "ether");

    let reverted = false;
    try{
        await instanceApp.fundFee({from:airline_5, value:ten_ether_fund});
    }catch(err){
        reverted = true;
    }
    assert.equal(reverted, true, "Unregistered Airline trying to change status");
});
/*
it("(fund) Fund can't accept value above 10 ether ", async() => {
    let instanceApp = await FlightSuretyApp.deployed();
    let airline_2 = accounts[1];
    let nine_ether_fund = await web3.utils.toWei("9", "ether");

    let reverted = false;
    try{
        await instanceApp.fundFee({from:airline_2, value:nine_ether_fund});
    }catch(err){
        reverted = true;
    }
    assert.equal(reverted, true, "The initial airline fee is equal to 10 ether");
});*/


it("(fund) check isFunded is true", async() => {
    let instanceApp = await FlightSuretyApp.deployed();
    let airline_1 = accounts[0];
    let airline_1_details = await instanceApp.getAirline.call(airline_1);
    assert.equal(airline_1_details[3], true);
});


it("(voting) register by multiparty consensus voting", async() => {
    
    let instanceApp = await FlightSuretyApp.deployed();
    let num_airlines = await instanceApp.getNumAirlinesRegistred.call();
    let ten_ether_fund = await web3.utils.toWei("10", "ether"); 

    assert.equal(num_airlines, 5);
    
    let airline_1 = accounts[0];
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

    //1st airline is already registered
    //let owner_details = await instanceApp.getAirline.call(airline_1);
    //assert.equal(owner_details[2], true);
   
    //IF MORE THE 50% REGISTER THE COMPANY
    //await instanceApp.fundFee({from:airline_1, value:ten_ether_fund});
    await instanceApp.fundFee({from:airline_2, value:ten_ether_fund});
    await instanceApp.fundFee({from:airline_3, value:ten_ether_fund});
    await instanceApp.fundFee({from:airline_4, value:ten_ether_fund});
    
    await instanceApp.vote(airline_5, {from:airline_1});
    await instanceApp.vote(airline_5, {from:airline_2});
    //await instanceApp.vote(airline_5, {from:airline_3});

    //2 of 4 (more than 50%)
    airline_5_details = await instanceApp.getAirline.call(airline_5);
    assert.equal(airline_5_details[4].length, 2);

    //isRegistered is true
    assert.equal(airline_5_details[2], true);

    //isFunded is false
    assert.equal(airline_5_details[3], false);
});
/*
it("(voting) no funded airline can vote", async() => {

    let instanceApp = await config.flightSuretyApp;
    let airline_2 = accounts[1];
    let airline_5 = accounts[4];
    let airline_2_details = await instanceApp.getAirline(airline_2);
    assert.equal(airline_2_details[3], false);

    try{
        await instanceApp.vote(airline_5, {from:airline_2});
    }catch(err){
        assert.equal(err.reason,"Airline can not participate in contract until it submits funding of 10 ether");
    }
});


it("(voting) Funded Airline can vote", async() => {
    let instanceApp = await config.flightSuretyApp;
    let airline_1 = accounts[0];
    let airline_5 = accounts[4];

    await instanceApp.vote(airline_5, {from:airline_1});

    airline_5_details = await instanceApp.getAirline.call(airline_5);

    assert.equal(airline_5_details[2], false);
    assert.equal(airline_5_details[4].length, 1);
});

it("(voting) An airline can't vote again", async() => {
    let instanceApp = await config.flightSuretyApp;
    let airline_1 = accounts[0];
    let airline_5 = accounts[4];

    try{
        await instanceApp.vote(airline_5, {from:airline_1});
    }catch(err){
        assert.equal(err.reason,"The Airline already voted!");
    }
});*/

it("(Flight) create a flight", async() => {
    
    //use this site: https://www.kwe.co.jp/en/useful-contents/code1

    let instanceApp = await FlightSuretyApp.deployed();

    let airline_1 = accounts[0];
    let flight_code = "AAL001";
    let origin = "Rio";
    let destination = "London";
    let date = "2020-06-09T12:00:00Z"
    let timestamp = new Date(date).getTime();

    await instanceApp.registerFlight(flight_code, origin, destination, timestamp, {from:airline_1});
    
    let flight_hash = await instanceApp.getFlightKey.call(airline_1, flight_code, timestamp);
    let flight_info = await instanceApp.getFlight.call(flight_hash);

    assert.equal(flight_info[0],flight_code);
    assert.equal(flight_info[1],origin);
    assert.equal(flight_info[2],destination);
    assert.equal(flight_info[3],timestamp);
    assert.equal(flight_info[4],true);
    assert.equal(flight_info[5],false);
    assert.equal(flight_info[6],0);
    assert.equal(flight_info[7], airline_1);    
});

it("(Flight) create a flight - problem interface", async() => {
    
    //use this site: https://www.kwe.co.jp/en/useful-contents/code1

    let instanceApp = await FlightSuretyApp.deployed();

    let airline_1 = accounts[0];
    let flight_code = "567 AA";
    let origin = "REC";
    let destination = "BSB";
    //let date = "2020-06-09T12:00:00Z"
    let timestamp = 1591704000000;

    await instanceApp.registerFlight(flight_code, origin, destination, timestamp, {from:airline_1});
    
    let flight_hash = await instanceApp.getFlightKey.call(airline_1, flight_code, timestamp);
    let flight_info = await instanceApp.getFlight.call(flight_hash);

    assert.equal(flight_info[0],flight_code);
    assert.equal(flight_info[1],origin);
    assert.equal(flight_info[2],destination);
    assert.equal(flight_info[3],timestamp);
    assert.equal(flight_info[4],true);
    assert.equal(flight_info[5],false);
    assert.equal(flight_info[6],0);
    assert.equal(flight_info[7], airline_1);    
});
//567 AA REC BSB 1591704000000 0x024Fa683EB32b6340f42c99e6e4575Acb17F706A

it("(Flight) Update Status", async() => {
    
    let instanceApp = await FlightSuretyApp.deployed();

    let airline_1 = accounts[0];
    let flight_code = "AAL001";
    let date = "2020-06-09T12:00:00Z"
    let timestamp = new Date(date).getTime();

    let flight_hash = await instanceApp.getFlightKey.call(airline_1, flight_code, timestamp);

    let STATUS_CODE_LATE_TECHNICAL = 40;
    await instanceApp.updateFlightStatus(flight_hash, STATUS_CODE_LATE_TECHNICAL);
    
    let flight_info = await instanceApp.getFlight.call(flight_hash);
    assert.equal(flight_info[6], STATUS_CODE_LATE_TECHNICAL);
});


it("(Buy an insure) ", async() => {

    let instanceApp = await FlightSuretyApp.deployed();

    let airline_1 = accounts[0];
    let flight_code = "AAL001";
    let date = "2020-06-09T12:00:00Z"
    let timestamp = new Date(date).getTime();

    let user_client = accounts[6];
    let one_ether_insure = await web3.utils.toWei("1", "ether");

    //verificar se o status do voo foi atualizado
    await instanceApp.buy(airline_1, flight_code, timestamp, {from:user_client, value:one_ether_insure});
    let flight_hash = await instanceApp.getFlightKey.call(airline_1, flight_code, timestamp);
    let flight_info = await instanceApp.getFlight.call(flight_hash);
    assert.equal(flight_info[5],true);

    //verificar se o valor enviado bate com o valor armazenado pela estrutura
    let insure_value = await instanceApp.getInsuredClient.call(flight_hash, {from:user_client});
    assert.equal(one_ether_insure, insure_value);

});

it("(Credit Insuree) ", async() => {

    let instanceApp = await FlightSuretyApp.deployed();

    let airline_1 = accounts[0];
    let flight_code = "AAL001";
    let date = "2020-06-09T12:00:00Z"
    let timestamp = new Date(date).getTime();

    let flight_hash = await instanceApp.getFlightKey.call(airline_1, flight_code, timestamp);
   
    let user_client = accounts[6];
    let statusCode = 20;
    
    await instanceApp.processFlightStatus(airline_1, flight_code, timestamp, statusCode, {from:user_client});
    let insure_value = await instanceApp.getInsuredClient(flight_hash, {from:user_client});
    let insure_due = await instanceApp.getInsuredDue(flight_hash, {from:user_client});
    assert.equal(insure_due, insure_value * 1.5);
});


it("(Pay Insuree) ", async() => {

    let instanceApp = await FlightSuretyApp.deployed();

    let user_client = accounts[6];
    let airline_1 = accounts[0];
    let flight_code = "AAL001";
    let date = "2020-06-09T12:00:00Z"
    let timestamp = new Date(date).getTime();

    let flight_hash = await instanceApp.getFlightKey.call(airline_1, flight_code, timestamp);

    let user_balance_before = await web3.eth.getBalance(user_client);
    user_balance_before = new BigNumber(user_balance_before);
    
    let insure_due_before = await instanceApp.getInsuredDue(flight_hash, {from:user_client});
    insure_due_before = new BigNumber(insure_due_before);

    assert.equal(insure_due_before > 0, true);

    await instanceApp.withdraw(flight_hash, {from:user_client});

    let insure_due_after = await instanceApp.getInsuredDue(flight_hash, {from:user_client});
    insure_due_after = new BigNumber(insure_due_after);
    let user_balance_after = await web3.eth.getBalance(user_client);
    user_balance_after = new BigNumber(user_balance_after);

    assert.equal(insure_due_after, 0);
    assert.equal(user_balance_before < user_balance_after, true);

});
 
});
