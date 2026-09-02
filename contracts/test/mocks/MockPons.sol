// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SiteToken} from "../../src/SiteToken.sol";

contract MockPonsCurve {
    SiteToken public token;
    bool public shouldFail;

    function setToken(address token_) external {
        token = SiteToken(token_);
    }

    function setShouldFail(bool v) external {
        shouldFail = v;
    }

    function buy(uint256, uint256, address recipient) external payable returns (uint256 tokensOut) {
        if (shouldFail) revert("fail");
        tokensOut = 1 ether;
        require(token.transfer(recipient, tokensOut), "xfer");
    }

    receive() external payable {}
}

contract MockPonsFactory {
    struct Launch {
        address token;
        address curve;
        address deployer;
        uint8 phase;
        bool exists;
    }

    mapping(address => Launch) public launches;

    function setLaunch(address token, address curve, uint8 phase, bool exists) external {
        launches[token] = Launch({token: token, curve: curve, deployer: msg.sender, phase: phase, exists: exists});
    }

    function getLaunchedToken(address token)
        external
        view
        returns (address tokenOut, address curve, address deployer, uint8 phase, bool exists)
    {
        Launch memory l = launches[token];
        return (l.token, l.curve, l.deployer, l.phase, l.exists);
    }
}
