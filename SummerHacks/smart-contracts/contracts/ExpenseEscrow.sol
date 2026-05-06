// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ExpenseEscrow {
    address public admin;

    struct Escrow {
        address user;
        uint256 amount;
        bool isResolved;
    }

    // challengeId -> Escrow details
    mapping(string => Escrow) public challenges;

    event StakeLocked(string indexed challengeId, address indexed user, uint256 amount);
    event StakeReturned(string indexed challengeId, address indexed user, uint256 amount);
    event StakeBurned(string indexed challengeId, address indexed user, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can resolve stakes");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @dev User locks their ETH stake for a specific challenge.
     */
    function lockStake(string memory challengeId) external payable {
        require(msg.value > 0, "Stake must be > 0");
        require(challenges[challengeId].user == address(0), "Challenge ID already exists");

        challenges[challengeId] = Escrow({
            user: msg.sender,
            amount: msg.value,
            isResolved: false
        });

        emit StakeLocked(challengeId, msg.sender, msg.value);
    }

    /**
     * @dev User succeeded. Admin returns their ETH.
     */
    function resolveSuccess(string memory challengeId) external onlyAdmin {
        Escrow storage escrow = challenges[challengeId];
        require(escrow.amount > 0, "Challenge not found or zero stake");
        require(!escrow.isResolved, "Already resolved");

        escrow.isResolved = true;
        uint256 amountToSend = escrow.amount;

        (bool success, ) = payable(escrow.user).call{value: amountToSend}("");
        require(success, "ETH transfer failed");

        emit StakeReturned(challengeId, escrow.user, amountToSend);
    }

    /**
     * @dev User failed. Admin burns their ETH (sends to address(0)).
     */
    function resolveFailure(string memory challengeId) external onlyAdmin {
        Escrow storage escrow = challenges[challengeId];
        require(escrow.amount > 0, "Challenge not found or zero stake");
        require(!escrow.isResolved, "Already resolved");

        escrow.isResolved = true;
        uint256 amountToBurn = escrow.amount;

        // Send to address(0) or a dead address
        address deadAddress = 0x000000000000000000000000000000000000dEaD;
        (bool success, ) = payable(deadAddress).call{value: amountToBurn}("");
        require(success, "Burn transfer failed");

        emit StakeBurned(challengeId, escrow.user, amountToBurn);
    }
}
