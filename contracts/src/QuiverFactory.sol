// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "./lib/Ownable.sol";
import {QuiverSubscription} from "./QuiverSubscription.sol";
import {SiteRegistry} from "./SiteRegistry.sol";
import {BondingCurve} from "./BondingCurve.sol";
import {SiteToken} from "./SiteToken.sol";

/// @title QuiverFactory
/// @notice Subscribers deploy one forever curve and one token in a single call.
contract QuiverFactory is Ownable {
    uint256 public constant DEFAULT_SUPPLY = 1_000_000_000 ether;
    uint256 public constant DEFAULT_PHANTOM = 1 ether;

    QuiverSubscription public immutable subscription;
    SiteRegistry public immutable registry;

    event Created(
        address indexed creator,
        address indexed token,
        address indexed curve,
        string slug,
        string name,
        string symbol,
        uint256 supply,
        uint256 phantomQuote
    );

    error NotSubscribed();
    error InvalidName();

    constructor(address initialOwner, address subscription_, address registry_) Ownable(initialOwner) {
        if (subscription_ == address(0) || registry_ == address(0)) revert ZeroAddress();
        subscription = QuiverSubscription(subscription_);
        registry = SiteRegistry(registry_);
    }

    function create(string calldata name, string calldata symbol, string calldata slug)
        external
        returns (address token, address curve)
    {
        return createWithParams(name, symbol, slug, DEFAULT_SUPPLY, DEFAULT_PHANTOM);
    }

    function createWithParams(
        string calldata name,
        string calldata symbol,
        string calldata slug,
        uint256 supply,
        uint256 phantomQuote
    ) public returns (address token, address curve) {
        if (!subscription.isActive(msg.sender)) revert NotSubscribed();
        if (bytes(name).length == 0 || bytes(name).length > 32) revert InvalidName();
        if (bytes(symbol).length == 0 || bytes(symbol).length > 12) revert InvalidName();
        if (supply == 0) supply = DEFAULT_SUPPLY;
        if (phantomQuote == 0) phantomQuote = DEFAULT_PHANTOM;

        curve = address(new BondingCurve(address(this), phantomQuote));
        token = address(new SiteToken(name, symbol, supply, curve));
        BondingCurve(payable(curve)).initialize(token);
        registry.register(slug, token, curve, msg.sender);

        emit Created(msg.sender, token, curve, slug, name, symbol, supply, phantomQuote);
    }
}
