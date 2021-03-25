var ERC721MintableComplete = artifacts.require('./CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_creator = accounts[0];
    const account_one = accounts[1];
    const account_two = accounts[2];
    const account_three = accounts[3];
    const account_four = accounts[4];
    const account_five = accounts[5];
    const account_six = accounts[6];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(account_creator);

            // TODO: mint multiple tokens
            await this.contract.mint(account_one,1,{from: account_creator});
            await this.contract.mint(account_two,2,{from: account_creator});
            await this.contract.mint(account_three,3,{from: account_creator});
            await this.contract.mint(account_four,4,{from: account_creator});
            await this.contract.mint(account_five,5,{from: account_creator});
        })

        it('should return total supply', async function () { 
            let total = await this.contract.totalSupply.call();
            assert.equal(total.toNumber(), 5, "Count of mint contracts isn't ok");
            
        })

        it('should get token balance', async function () { 
            let balance = await this.contract.balanceOf.call(account_five, {from: account_creator});
            assert.equal(balance.toNumber(), 1, "Balance of account_five should be 5");
            
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenURI = await this.contract.tokenURI.call(1, {from: account_one});
            assert.equal(tokenURI,"https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "URI token does not match");
        })

        it('should transfer token from one owner to another', async function () { 
            let tokenId=2;
            await this.contract.approve(account_four, tokenId, {from: account_two});
            await this.contract.transferFrom(account_two, account_four, tokenId, {from: account_two});
            currentOwner = await this.contract.ownerOf.call(tokenId);
            assert.equal(currentOwner, account_four, "Account_four ins't the owner");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(account_creator);
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let throws_error = false;
            try {
                await this.contract.mint(account_six,6,{from: account_two});
              } catch (e) {
                throws_error = true;
              }
              assert.equal(throws_error, true, "address is not account owner");
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.owner.call({from: account_one});
            assert.equal(owner, account_creator, "owner should be account_creator");
        })

    });
})
