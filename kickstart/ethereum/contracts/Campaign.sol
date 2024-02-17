// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(address(newCampaign));
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimumContribution;
    uint approversCount;
    mapping(address => bool) public approvers;
    uint requestCount;
    mapping(uint => Request) public requests;

    modifier restrictedMinimum() {
        require(msg.value > minimumContribution);
        _;
    }

    modifier restrictedManager() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable restrictedMinimum {
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory description, uint value, address recipient) 
        public restrictedManager {
            Request storage newRequest = requests[requestCount++];
            newRequest.description = description;
            newRequest.value = value;
            newRequest.recipient = payable(recipient);
            newRequest.complete = false;
            newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender], "Not an approver");
        require(!request.approvals[msg.sender], "Already approved");

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restrictedManager {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2), "Approves must be more than 50%");
        require(!request.complete, "Request already complete");

        request.recipient.transfer(request.value);
        request.complete = true;
    }
}