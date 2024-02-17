const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath = path.resolve(__dirname, 'build');

// Delete build folder if already present
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, "utf8");
const input = {
    language: 'Solidity',
    sources: {
        'Campaign.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'];

// Create build folder
fs.ensureDirSync(buildPath);

// Write to build forlder all contracts
for(let contract in output) {
    fs.outputJSONSync(
        path.resolve(buildPath, `${contract}.json`),
        output[contract]
    );
}