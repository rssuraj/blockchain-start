const ganache = require('ganache');
const { Web3 } = require('web3');
const assert = require('assert');
const { abi, evm } = require('../compile');

const web3 = new Web3(ganache.provider());

describe('Lottery', () => {
    let lottery;
    let accounts;

    beforeEach(async () => {
        accounts = await web3.eth.getAccounts();

        lottery = await new web3.eth.Contract(abi)
            .deploy({ data: evm.bytecode.object })
            .send({ from: accounts[0], gas: '1000000' });
    });

    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('aloows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call();
        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('aloows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call();
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    it('requires a minimum amount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
            });   
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    it('only manager can call pickWinner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    it('sends money to the winner and resets the players array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        // Get initial balance
        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        // Get final balance after winning
        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const difference = finalBalance - initialBalance;

        // The value will be slighty less than 2 ether because 
        // there is some value spent on gas for running this contract
        assert(difference > web3.utils.toWei('1.8', 'ether'));

        // assert empty players
        const players = await lottery.methods.getPlayers().call();
        assert.equal(0, players.length);

        // asert lottery balance is 0
        const lotteryBalance = await web3.eth.getBalance(lottery.options.address)
        assert.equal(0, lotteryBalance);
    });
});
