// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Minimal PONS v2 factory surface used to resolve the live QUIVER venue.
interface IPonsLaunchFactory {
    function getLaunchedToken(address token)
        external
        view
        returns (
            address tokenOut,
            address curve,
            address deployer,
            uint8 phase,
            bool exists
        );
}

interface IPonsCurve {
    function buy(uint256 quoteIn, uint256 minTokensOut, address recipient)
        external
        payable
        returns (uint256 tokensOut);
}
