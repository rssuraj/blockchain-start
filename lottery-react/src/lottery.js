import web3 from './web3';

const address = '0x108B0f173DD2eCe49fc9521032E19843Fde0235E';
const abi = [
    { 
        inputs: [], 
        stateMutability: 'nonpayable', 
        type: 'constructor' 
    },
    {
      inputs: [],
      name: 'enter',
      outputs: [],
      stateMutability: 'payable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getPlayers',
      outputs: [ [Object] ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'manager',
      outputs: [ [Object] ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'pickWinner',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [ [Object] ],
      name: 'players',
      outputs: [ [Object] ],
      stateMutability: 'view',
      type: 'function'
    }
  ];

  export default new web3.eth.Contract(abi, address);