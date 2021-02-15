// SPDX-License-Identifier: MIT

pragma solidity ^0.4.25;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/
    uint8 private constant AMOUNT_AIRLINES_COMPANY = 4;    
    uint256 private constant AIRLINE_FUNDING_VALUE = 10 ether;

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false

    struct Airline {
        address addr;
        string name;
        bool isRegistered;
        bool isFunded;
        bool exists;
        address[] multiCalls;
    }
    Airline[] private airlines_list;
    mapping(address => Airline) private airlines;

    struct Flight {
        string flight_code;
        string origin;
        string destination;
        uint timestamp;
        bool isRegistered;
        bool isInsured;
        uint8 status;
        address airline;
        address[] insured_clients;
    }
    mapping(bytes32 => Flight) private flights;
    //code of flight -> address of client -> value payed
    mapping(bytes32 => mapping(address => uint)) private insured_clients;

    //code of flight -> address of client -> value credit 
    mapping(bytes32 => mapping(address => uint)) private insured_due;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/


    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor
                                (
                                ) 
                                public 
    {
        contractOwner = msg.sender;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() 
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    modifier requireAirlineNotRegistred(address addr) {
        require(airlines[addr].exists, "Airline is already registered");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() public view returns(bool) 
    {
        return operational;
    }


    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus(bool mode) 
    external 
    requireContractOwner 
    {
        operational = mode;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */   
    function registerAirline(
                             address airline_address, 
                             string airline_name 
                            )
    external 
    requireIsOperational
    //requireAirlineNotRegistred(airline_address)
    {
        if(getNumAirlinesRegistred() >= AMOUNT_AIRLINES_COMPANY){
            createAirline(airline_address, airline_name, false, false, true);
        } else {
            createAirline(airline_address, airline_name, true, false, true);
        }
    }

    /**
    * @dev Create an Airline
    * 
    */
    function createAirline( 
                            address airline_address, 
                            string airline_name,
                            bool isRegistered,
                            bool isFunded, 
                            bool exists
                          ) 
    private 
    {
        Airline memory new_airline = Airline({
            addr: airline_address,
            name: airline_name,
            isRegistered: isRegistered,
            isFunded: isFunded,
            exists:exists,
            multiCalls: new address[](0)
        });
        airlines_list.push(new_airline);
        airlines[airline_address] = new_airline;
    }

    /**
     * @dev Get the arline information by address
     */
    function getAirline(address address_airline)external view returns(address, string, bool, bool, bool, address[])
    {

        Airline memory airline = airlines[address_airline];
        return (airline.addr, 
                airline.name, 
                airline.isRegistered, 
                airline.isFunded, 
                airline.exists,
                airline.multiCalls);
    }

    /**
     * @dev Ckeck if the majority accept the 
     *      new Airline on the group
     */
    function vote(address airline_address) 
    external 
    requireIsOperational 
    {
        
        require(!airlines[airline_address].isRegistered, "Airline is already Registered");
        require(airlines[msg.sender].isRegistered, "Unregistered voting company");
        require(airlines[msg.sender].isFunded, "Airline does not participate in contract until it submits funding of 10 ether");
        
        bool voted = checkDoubleVote(airline_address);
        require(!voted, "The Airline already voted!");
        
        Airline storage airline = airlines[airline_address];
        airline.multiCalls.push(msg.sender);
        if(airline.multiCalls.length >= (getNumAirlinesRegistred().div(2))){
            airline.isRegistered = true;
        }
    }

    /**
        @dev Check Double Vote
     */
    function checkDoubleVote(address airline_address) private view returns(bool){
        bool voted = false;
        uint length = airlines[airline_address].multiCalls.length; 
        for (uint i = 0; i < length; i++) {
            if (airlines[airline_address].multiCalls[i] == msg.sender) {
                voted = true;
                break;
            }
        }
        return voted;

    }

    /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */    
    function fund() external payable{
        require(airlines[msg.sender].isRegistered, "The Airline is not registered");
        require(msg.value == AIRLINE_FUNDING_VALUE, "The initial airline fee is equal to 10 ether");
        airlines[msg.sender].isFunded = true;
    }

    /**
    * @dev Register a future flight for insuring.
    *
    */  
    function registerFlight(string flight_code, 
                            string origin, 
                            string destination, 
                            uint timestamp
                            )
    external
    {
        bytes32 flight_hash = getFlightKey(msg.sender, flight_code, timestamp);
        require(!flights[flight_hash].isRegistered, "The flight is already registered");

        Flight memory new_flight = Flight({
            flight_code:flight_code,
            origin:origin,
            destination:destination, 
            timestamp:timestamp,
            isRegistered:true,
            isInsured:false,
            status:0,
            airline: msg.sender,
            insured_clients:new address[](0)
         });
        
        flights[flight_hash] = new_flight;
    }    

    /**
    * @dev Update the flight status.
    *
    */ 
    function updateFlightStatus(bytes32 flight_hash, uint8 status_code)
    external
    requireIsOperational 
    {
        Flight storage flight = flights[flight_hash];
        flight.status = status_code;
    }

   /**
    * @dev Buy insurance for a flight
    *
    */   
    function buy(
                address airline_address,
                string fligh_code,
                uint timestamp                             
                )
                external
                payable
    {
        require(airlines[airline_address].isFunded, "Airline does not participate in contract until it submits funding of 10 ether");
        require((msg.value > 0 ether && msg.value <= 1 ether), "It is not possible to accept this value of insure");
        
        bytes32 flight_hash = getFlightKey(airline_address, fligh_code, timestamp);
        require(insured_clients[flight_hash][msg.sender] == 0, "User already bought insurance for this flight");
        
        flights[flight_hash].isInsured = true;
        flights[flight_hash].insured_clients.push(msg.sender);
        insured_clients[flight_hash][msg.sender] = msg.value;
    }

    /**
     *  @dev Credits payouts to insurees
    */
    function creditInsurees(bytes32 flight_hash) external
    {
        require(flights[flight_hash].isRegistered, "Flight is not registered");
        require(flights[flight_hash].isInsured, "Flight dont have insuree");

        uint insure_payed_by_passanger = insured_clients[flight_hash][msg.sender];
        insured_due[flight_hash][msg.sender] = (insure_payed_by_passanger.mul(15)).div(10); 
    }
    
    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function pay(bytes32 flight_hash, uint8 value) external requireIsOperational
    {
        require(flights[flight_hash].isRegistered, "Flight is not registered");
        require(flights[flight_hash].isInsured, "Flight dont have insuree");
        require(insured_due[flight_hash][msg.sender] >= value, "Insuree does not have this amount of credit");
        
        insured_due[flight_hash][msg.sender] = insured_due[flight_hash][msg.sender].sub(value);
        msg.sender.transfer(value);
    }

    function getFlightKey
                        (
                            address airline,
                            string memory flight,
                            uint256 timestamp
                        )
                        pure
                        internal
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
    * @dev Get the amount of registred airlines.
    *
    */
    function getNumAirlinesRegistred() public view returns(uint){
        return airlines_list.length;
    }



}

