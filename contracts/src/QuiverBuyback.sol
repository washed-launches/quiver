// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "./lib/Ownable.sol";
import {ReentrancyGuard} from "./lib/ReentrancyGuard.sol";
import {IPonsCurve, IPonsLaunchFactory} from "./interfaces/IPons.sol";
import {QuiverTreasury} from "./QuiverTreasury.sol";

/// @title QuiverBuyback
/// @notice Spends subscription ETH on QUIVER via the live PONS venue.
/// If the token is unset or the venue cannot be bought, ETH is held for a later retry.
contract QuiverBuyback is Ownable, ReentrancyGuard {
    address public immutable ponsFactory;
    address public subscription;
    address public quiverToken;
    QuiverTreasury public treasury;

    uint8 internal constant PHASE_NOT_GRADUATED = 0;

    event SubscriptionSet(address indexed subscription);
    event TreasurySet(address indexed treasury);
    event QuiverTokenSet(address indexed token);
    event Bought(address indexed payer, uint256 ethIn, uint256 tokensOut, address venue);
    event Held(address indexed payer, uint256 amount, string reason);

    error NotSubscription();
    error AlreadySet();
    error TransferFailed();

    constructor(address initialOwner, address ponsFactory_) Ownable(initialOwner) {
        if (ponsFactory_ == address(0)) revert ZeroAddress();
        ponsFactory = ponsFactory_;
    }

    function setSubscription(address subscription_) external onlyOwner {
        if (subscription_ == address(0)) revert ZeroAddress();
        if (subscription != address(0)) revert AlreadySet();
        subscription = subscription_;
        emit SubscriptionSet(subscription_);
    }

    function setTreasury(address treasury_) external onlyOwner {
        if (treasury_ == address(0)) revert ZeroAddress();
        treasury = QuiverTreasury(payable(treasury_));
        emit TreasurySet(treasury_);
    }

    function setQuiverToken(address token) external onlyOwner {
        if (token == address(0)) revert ZeroAddress();
        quiverToken = token;
        emit QuiverTokenSet(token);
    }

    function onPayment(address payer) external payable nonReentrant {
        if (msg.sender != subscription) revert NotSubscription();
        _tryBuy(payer, msg.value);
    }

    function executeHeld() external nonReentrant {
        uint256 bal = address(this).balance;
        if (bal == 0) return;
        _tryBuy(msg.sender, bal);
    }

    function _tryBuy(address payer, uint256 amount) internal {
        if (amount == 0) return;
        if (quiverToken == address(0) || address(treasury) == address(0)) {
            emit Held(payer, amount, "token-unset");
            return;
        }

        (bool ok, bytes memory data) = ponsFactory.staticcall(
            abi.encodeWithSelector(IPonsLaunchFactory.getLaunchedToken.selector, quiverToken)
        );
        if (!ok || data.length < 32 * 5) {
            emit Held(payer, amount, "pons-unreadable");
            return;
        }

        (, address curve,, uint8 phase, bool exists) =
            abi.decode(data, (address, address, address, uint8, bool));

        if (!exists || curve == address(0)) {
            emit Held(payer, amount, "pons-unknown");
            return;
        }

        if (phase != PHASE_NOT_GRADUATED) {
            emit Held(payer, amount, "graduated-hold");
            return;
        }

        try IPonsCurve(curve).buy{value: amount}(amount, 0, address(treasury)) returns (uint256 tokensOut) {
            emit Bought(payer, amount, tokensOut, curve);
        } catch {
            emit Held(payer, amount, "buy-failed");
        }
    }

    receive() external payable {}
}
