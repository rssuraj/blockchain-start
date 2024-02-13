require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const { abi, evm } = require('./compile');

const provider = new HDWalletProvider(
    process.env.ACCOUNT_MNEMONIC,
    process.env.TEST_NETWORK
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);

    const inbox = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object, arguments: [ 'Hi there public Test Network!' ] })
        .send({ from: accounts[0], gas: '1000000' });
    
    console.log('Contract deployed to ', inbox.options.address);

    // Stops the process after running above
    provider.engine.stop();
}

deploy();
