// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "./lib/Ownable.sol";
import {ReentrancyGuard} from "./lib/ReentrancyGuard.sol";
import {QuiverBuyback} from "./QuiverBuyback.sol";

/// @title QuiverSubscription
/// @notice On-chain ETH subscription. 100% of payment is forwarded to buybacks.
contract QuiverSubscription is Ownable, ReentrancyGuard {
    struct Plan {
        uint256 price;
        uint32 duration;
        bool active;
    }

    QuiverBuyback public buyback;
    uint256 public planCount;
    mapping(uint256 => Plan) public plans;
    mapping(address => uint256) public expiresAt;

    event PlanSet(uint256 indexed planId, uint256 price, uint32 duration, bool active);
    event Subscribed(address indexed account, uint256 indexed planId, uint256 paid, uint256 expiresAt);
    event BuybackSet(address indexed buyback);

    error InvalidPlan();
    error WrongPrice();
    error BuybackNotSet();
    error TransferFailed();

    constructor(address initialOwner) Ownable(initialOwner) {
        _setPlan(0, 0.05 ether, 30 days, true);
        _setPlan(1, 0.45 ether, 365 days, true);
        planCount = 2;
    }

    function setBuyback(address buyback_) external onlyOwner {
        if (buyback_ == address(0)) revert ZeroAddress();
        buyback = QuiverBuyback(payable(buyback_));
        emit BuybackSet(buyback_);
    }

    function setPlan(uint256 planId, uint256 price, uint32 duration, bool active) external onlyOwner {
        if (duration == 0 || price == 0) revert InvalidPlan();
        if (planId == planCount) planCount += 1;
        if (planId > planCount) revert InvalidPlan();
        _setPlan(planId, price, duration, active);
    }

    function isActive(address account) public view returns (bool) {
        return expiresAt[account] >= block.timestamp;
    }

    function remaining(address account) external view returns (uint256) {
        uint256 end = expiresAt[account];
        if (end <= block.timestamp) return 0;
        return end - block.timestamp;
    }

    function subscribe(uint256 planId) external payable nonReentrant {
        Plan memory plan = plans[planId];
        if (!plan.active || plan.price == 0 || plan.duration == 0) revert InvalidPlan();
        if (msg.value != plan.price) revert WrongPrice();
        if (address(buyback) == address(0)) revert BuybackNotSet();

        uint256 start = expiresAt[msg.sender];
        if (start < block.timestamp) start = block.timestamp;
        uint256 end = start + plan.duration;
        expiresAt[msg.sender] = end;

        emit Subscribed(msg.sender, planId, msg.value, end);
        buyback.onPayment{value: msg.value}(msg.sender);
    }

    function _setPlan(uint256 planId, uint256 price, uint32 duration, bool active) internal {
        plans[planId] = Plan({price: price, duration: duration, active: active});
        emit PlanSet(planId, price, duration, active);
    }
}
