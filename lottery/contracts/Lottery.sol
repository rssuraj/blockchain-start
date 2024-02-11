// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        // Base condition before executing the function
        require(msg.value > 0.01 ether);
        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(manager)));
    }

    function pickWinner() public restricted {
        // Get random hash value
        uint index = random() % players.length;

        // Transfer the total ether collected in this.balance
        payable(players[index]).transfer(address(this).balance);

        // Reset the players for new round
        players = new address[](0);
    }

    modifier restricted() {
        // Allow only manager to call this function
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }
}