const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');

const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

describe('Campaigns', () => {
    let accounts;
    let factory;
    let campaignAddress;
    let campaign;

    beforeEach(async () => {
        accounts = await web3.eth.getAccounts();

        factory = await new web3.eth.Contract(compiledFactory.abi)
            .deploy({ data: compiledFactory.evm.bytecode.object })
            .send({ from: accounts[0], gas: '5000000' });
        
        await factory.methods.createCampaign('100')
            .send({ from: accounts[0], gas: '5000000' });
        
        [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

        // Already deployed contract instance
        campaign = new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
    });

    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1], 
            value: '200'
        });

        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it('requires a minum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[1], 
                value: '5'
            });
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods
            .createRequest('By Bat', '100', accounts[1])
            .send({ from: accounts[0], gas: '5000000' });

        const request = await campaign.methods.requests(0).call();
        assert.equal('By Bat', request.description);
    });

    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0], 
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
            .createRequest('By Bat', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({ from: accounts[0], gas: '5000000' });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0], 
            gas: '5000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0], 
            gas: '5000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        assert(balance > 104);
    });

});