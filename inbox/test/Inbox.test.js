const ganache = require('ganache');
const { Web3 } = require('web3');
const assert = require('assert');
const { abi, evm } = require('../compile');

const web3 = new Web3(ganache.provider());

describe('Inbox', () => {
    const INITIAL_MESSAGE = 'Hi there!';
    let accounts;
    let inbox;

    beforeEach(async () => {
        // Get a list of all accounts
        accounts = await web3.eth.getAccounts();
    
        // Use one of those accounts to deploy the contract
        inbox = await new web3.eth.Contract(JSON.parse(abi))
            .deploy({ data: evm.bytecode.object, arguments: [ INITIAL_MESSAGE ] })
            .send({ from: accounts[0], gas: '1000000' });
    });

    it('deploys a contract', () => {
        // Check if the inbox contract has an address 
        // Which marks the successfull creation of contract
        assert.ok(inbox.options.address);
    });

    it('has an initial message', async () => {
        // Call a getter method available in the deployed contract
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_MESSAGE)
    });

    it('can change the message', async () => {
        // Send a transaction to update the deployed contracts data
        await inbox.methods.setMessage('Bye there!').send({ from: accounts[0] });
        
        // Call a getter method available in the deployed contract
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Bye there!');
    });
});
