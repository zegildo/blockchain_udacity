import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        //this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {
           
            this.owner = accts[0];
            console.log("this.owner:",this.owner);
            let counter = 1;
            
            while(this.airlines.length < 5) {
                this.airlines.push(accts[counter++]);
            }

            while(this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            callback();
        });
    }

    getAirlinesRegistred(callback){
        let self = this;
        self.flightSuretyApp.methods
            .getAirlinesRegistred()
            .call({from: self.owner}, callback);
    }

    isOperational(callback) {
       let self = this;
       self.flightSuretyApp.methods
            .isOperational()
            .call({from: self.owner}, callback);
    }

    fetchFlightStatus(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        } 
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner}, (error, result) => {
                callback(error, payload);
            });
    }

    registerAirline(senderAddress, airlineAddress, airlineName){
        console.log("registerAirline: ",senderAddress, airlineAddress, airlineName);
        let self = this;
        self.flightSuretyApp.methods
            .registerAirline(airlineAddress, airlineName)
            .send({from: senderAddress, gas: 5000000});
    }

    pay(sender){
        console.log("paying tax");
        let self = this;
        let ten_ether_fund = this.web3.utils.toWei("10", "ether");
        self.flightSuretyApp.methods.fundFee().send({from: sender, value:ten_ether_fund});
    }

    registerFlight(flight_code, origin, destination, timestamp, sender){
        let self = this;
        self.flightSuretyApp.methods.registerFlight(
            flight_code, 
            origin, 
            destination, 
            timestamp).send({from: sender});
    }

    buy(airline_address, fligh_code, timestamp, value, sender){
        let self = this;
        let amount = this.web3.utils.toWei(value, "ether");
        self.flightSuretyApp.methods.buy(
            airline_address, 
            fligh_code, 
            timestamp).send({from:sender, value:amount});
    }

    claimWidraw(flight_hash, sender){
        let self = this;
        self.flightSuretyApp.methods.withdraw(flight_hash);
    }

    getFlightKey(airline, flight, timestamp){
        let self = this;
        self.flightSuretyApp.methods.getFlightKey(airline, flight, timestamp);

    }

}