// SPDX-License-Identifier: MIT

pragma solidity >=0.4.21;
import "./verifier.sol";
import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token{
    
    Verifier public verifier;
    
    constructor(address verifier_addr) public{
        verifier = Verifier(verifier_addr);
    }     

    // TODO define a solutions struct that can hold an index & an address
    struct Solutions{
        uint index;
        address to;
    }

    // TODO define an array of the above struct
    Solutions[] solutions_list;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solutions) private unique_solutions;

    // TODO Create an event to emit when a solution is added
    event Solution_is_added(uint tokenID, address to);


    // TODO Create a function to add the solutions to the array and emit the event
    function add(address to, uint tokenID, bytes32 key) public {
        Solutions memory solution = Solutions({index:tokenID, to:to});
        solutions_list.push(solution);
        unique_solutions[key] = solution;
        emit Solution_is_added(tokenID, to);
    }


// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly

    function mintNFT(
                address to,
                uint tokenID,
                uint[2] memory a,
                uint[2][2] memory b,
                uint[2] memory c,
                uint[2] memory inputs) public {
        bytes32 key = keccak256(abi.encodePacked(a,b,c,inputs));
        require(unique_solutions[key].to == address(0), "Solution is in use.");
        require(verifier.verifyTx(a,b,c,inputs), "Solution is not valid");
        
        add(to, tokenID, key);
        super.mint(to, tokenID);
    }

}




  


























