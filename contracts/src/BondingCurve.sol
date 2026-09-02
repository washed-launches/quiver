// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "./lib/ReentrancyGuard.sol";
import {SiteToken} from "./SiteToken.sol";

/// @title BondingCurve
/// @notice Forever constant-product curve. Protocol fee is hardcoded to 0.
/// k = (phantomQuote + realQuote) * tokenReserve
contract BondingCurve is ReentrancyGuard {
    uint16 public constant PROTOCOL_FEE_BPS = 0;

    address public immutable factory;
    uint256 public immutable phantomQuote;

    SiteToken public token;
    uint256 public realQuote;
    uint256 public tokenReserve;
    bool public initialized;

    event Initialized(address indexed token, uint256 tokenReserve, uint256 phantomQuote);
    event Buy(address indexed buyer, address indexed recipient, uint256 quoteIn, uint256 tokensOut);
    event Sell(address indexed seller, address indexed recipient, uint256 tokensIn, uint256 quoteOut);

    error AlreadyInitialized();
    error NotInitialized();
    error NotFactory();
    error ZeroValue();
    error Slippage();
    error InsufficientReserve();
    error TransferFailed();

    constructor(address factory_, uint256 phantomQuote_) {
        if (factory_ == address(0) || phantomQuote_ == 0) revert ZeroValue();
        factory = factory_;
        phantomQuote = phantomQuote_;
    }

    function initialize(address token_) external {
        if (msg.sender != factory) revert NotFactory();
        if (initialized) revert AlreadyInitialized();
        if (token_ == address(0)) revert ZeroValue();
        token = SiteToken(token_);
        tokenReserve = token.balanceOf(address(this));
        if (tokenReserve == 0) revert ZeroValue();
        initialized = true;
        emit Initialized(token_, tokenReserve, phantomQuote);
    }

    function virtualQuote() public view returns (uint256) {
        return phantomQuote + realQuote;
    }

    function spotPrice() external view returns (uint256) {
        if (!initialized || tokenReserve == 0) return 0;
        return (virtualQuote() * 1e18) / tokenReserve;
    }

    function quoteBuy(uint256 quoteIn) public view returns (uint256 tokensOut) {
        if (!initialized || quoteIn == 0) return 0;
        uint256 vq = virtualQuote();
        tokensOut = (tokenReserve * quoteIn) / (vq + quoteIn);
    }

    function quoteSell(uint256 tokensIn) public view returns (uint256 quoteOut) {
        if (!initialized || tokensIn == 0) return 0;
        uint256 vq = virtualQuote();
        quoteOut = (vq * tokensIn) / (tokenReserve + tokensIn);
    }

    function buy(uint256 minTokensOut, address recipient) external payable nonReentrant returns (uint256 tokensOut) {
        if (!initialized) revert NotInitialized();
        if (msg.value == 0 || recipient == address(0)) revert ZeroValue();
        tokensOut = quoteBuy(msg.value);
        if (tokensOut < minTokensOut) revert Slippage();
        if (tokensOut == 0 || tokensOut > tokenReserve) revert InsufficientReserve();

        realQuote += msg.value;
        tokenReserve -= tokensOut;
        if (!token.transfer(recipient, tokensOut)) revert TransferFailed();
        emit Buy(msg.sender, recipient, msg.value, tokensOut);
    }

    function sell(uint256 tokensIn, uint256 minQuoteOut, address recipient)
        external
        nonReentrant
        returns (uint256 quoteOut)
    {
        if (!initialized) revert NotInitialized();
        if (tokensIn == 0 || recipient == address(0)) revert ZeroValue();
        quoteOut = quoteSell(tokensIn);
        if (quoteOut < minQuoteOut) revert Slippage();
        if (quoteOut == 0 || quoteOut > realQuote) revert InsufficientReserve();

        if (!token.transferFrom(msg.sender, address(this), tokensIn)) revert TransferFailed();
        realQuote -= quoteOut;
        tokenReserve += tokensIn;

        (bool ok,) = recipient.call{value: quoteOut}("");
        if (!ok) revert TransferFailed();
        emit Sell(msg.sender, recipient, tokensIn, quoteOut);
    }

    receive() external payable {
        revert ZeroValue();
    }
}
