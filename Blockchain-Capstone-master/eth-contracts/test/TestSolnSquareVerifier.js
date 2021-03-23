// Test if a new solution can be added for contract - SolnSquareVerifier
// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
let Verifier = artifacts.require('Verifier');
let SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
let w_proof = require('../../zokrates/code/square/proof');

contract('TestSolnSquareVerifier', accounts => {

    const account_creator = accounts[0];
    const account_one = accounts[1];
    const account_two = accounts[2];

    beforeEach(async function () { 
        const verifier = await Verifier.new({from:account_creator});
        this.contract = await SolnSquareVerifier.new(verifier.address,{from: account_creator});
    })

    it('Add a new Solution', async function(){

        let key = web3.utils.keccak256( w_proof.proof.a, 
                                        w_proof.proof.b, 
                                        w_proof.proof.c, 
                                        w_proof.inputs
                                    );
        let added = false;
        try{
            await this.contract.add(account_one, 1, key, {from:account_creator});
            added = true;
        }catch(e){
            added = false;
        }
        assert.equal(added,true,"Solution don't added!");
    })

    it('Mint a new NFT verified', async function(){
        let minted = true;
        try{
            minted = await this.contract.mint(account_one, 2, w_proof.proof.a, 
                                                     w_proof.proof.b,
                                                     w_proof.proof.c,
                                                     w_proof.inputs,
                                                     {from:account_creator}
                                            );
        }
        catch(e)
        {
            console.log(e);
            minted = false;
        }
        assert.equal(minted, true,"Solution wasn't minted");
    }) 
    

    it('token with incorrect proof',async function(){
        let minted = true;
        let inputs = [7,32];
        try{
            await this.contract.mint(account_one, 2, w_proof.proof.a, 
                                                     w_proof.proof.b,
                                                     w_proof.proof.c,
                                                     inputs,
                                                     {from:account_creator}
                                    );
        }catch(e){
            minted = false;
        }
        assert.equal(minted, false,"Solution wasn't minted");
    })

});