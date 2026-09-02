// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "./lib/Ownable.sol";

interface IERC20View {
    function balanceOf(address account) external view returns (uint256);
}

/// @title QuiverTreasury
/// @notice Holds bought-back QUIVER. No silent withdrawals in v1.
contract QuiverTreasury is Ownable {
    address public quiverToken;

    event QuiverTokenSet(address indexed token);

    error AlreadySet();

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setQuiverToken(address token) external onlyOwner {
        if (token == address(0)) revert ZeroAddress();
        if (quiverToken != address(0)) revert AlreadySet();
        quiverToken = token;
        emit QuiverTokenSet(token);
    }

    function quiverBalance() external view returns (uint256) {
        if (quiverToken == address(0)) return 0;
        return IERC20View(quiverToken).balanceOf(address(this));
    }

    receive() external payable {}
}
