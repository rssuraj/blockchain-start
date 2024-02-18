import Web3 from 'web3';
const HDWalletProvider = require('@truffle/hdwallet-provider');

let web3;

if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    window.ethereum.request({ method: 'eth_requestAccounts' });
    web3 = new Web3(window.ethereum);
}
else {
    const provider = new HDWalletProvider(
        process.env.ACCOUNT_MNEMONIC,
        process.env.TEST_NETWORK
    );
    web3 = new Web3(provider);
}
 
export default web3;