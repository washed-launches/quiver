// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "./lib/Ownable.sol";

/// @title SiteRegistry
/// @notice Maps a human slug (and optional custom hostname) to one forever curve.
contract SiteRegistry is Ownable {
    struct Site {
        address token;
        address curve;
        address creator;
        bytes32 hostnameHash;
        string slug;
    }

    address public factory;

    mapping(bytes32 => address) public tokenBySlugHash;
    mapping(bytes32 => address) public tokenByHostnameHash;
    mapping(address => Site) public siteByToken;
    address[] public tokens;

    event FactorySet(address indexed factory);
    event SiteRegistered(address indexed token, address indexed curve, address indexed creator, string slug);
    event HostnameSet(address indexed token, string hostname, bytes32 hostnameHash);

    error NotFactory();
    error NotCreator();
    error InvalidSlug();
    error SlugTaken();
    error UnknownSite();
    error HostnameTaken();
    error AlreadySet();

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setFactory(address factory_) external onlyOwner {
        if (factory_ == address(0)) revert ZeroAddress();
        if (factory != address(0)) revert AlreadySet();
        factory = factory_;
        emit FactorySet(factory_);
    }

    function siteCount() external view returns (uint256) {
        return tokens.length;
    }

    function getSite(address token) external view returns (Site memory) {
        return siteByToken[token];
    }

    function getBySlug(string calldata slug) external view returns (Site memory) {
        return siteByToken[tokenBySlugHash[keccak256(bytes(_normalizeSlug(slug)))] ];
    }

    function register(string calldata slug, address token, address curve, address creator) external {
        if (msg.sender != factory) revert NotFactory();
        string memory normalized = _normalizeSlug(slug);
        bytes32 slugHash = keccak256(bytes(normalized));
        if (tokenBySlugHash[slugHash] != address(0)) revert SlugTaken();
        if (token == address(0) || curve == address(0) || creator == address(0)) revert ZeroAddress();

        tokenBySlugHash[slugHash] = token;
        siteByToken[token] =
            Site({token: token, curve: curve, creator: creator, hostnameHash: bytes32(0), slug: normalized});
        tokens.push(token);
        emit SiteRegistered(token, curve, creator, normalized);
    }

    function setHostname(address token, string calldata hostname) external {
        Site storage site = siteByToken[token];
        if (site.token == address(0)) revert UnknownSite();
        if (msg.sender != site.creator && msg.sender != owner) revert NotCreator();

        bytes32 nextHash = keccak256(bytes(_normalizeHost(hostname)));
        if (tokenByHostnameHash[nextHash] != address(0) && tokenByHostnameHash[nextHash] != token) {
            revert HostnameTaken();
        }

        if (site.hostnameHash != bytes32(0) && site.hostnameHash != nextHash) {
            delete tokenByHostnameHash[site.hostnameHash];
        }
        site.hostnameHash = nextHash;
        tokenByHostnameHash[nextHash] = token;
        emit HostnameSet(token, hostname, nextHash);
    }

    function _normalizeSlug(string memory slug) internal pure returns (string memory) {
        bytes memory raw = bytes(slug);
        uint256 len = raw.length;
        if (len < 3 || len > 32) revert InvalidSlug();
        if (raw[0] == "-" || raw[len - 1] == "-") revert InvalidSlug();
        for (uint256 i; i < len; i++) {
            bytes1 c = raw[i];
            if (c >= "A" && c <= "Z") {
                raw[i] = bytes1(uint8(c) + 32);
                c = raw[i];
            }
            bool ok = (c >= "a" && c <= "z") || (c >= "0" && c <= "9") || c == "-";
            if (!ok) revert InvalidSlug();
        }
        return string(raw);
    }

    function _normalizeHost(string memory host) internal pure returns (string memory) {
        bytes memory raw = bytes(host);
        if (raw.length < 3 || raw.length > 253) revert InvalidSlug();
        for (uint256 i; i < raw.length; i++) {
            bytes1 c = raw[i];
            if (c >= "A" && c <= "Z") raw[i] = bytes1(uint8(c) + 32);
        }
        return string(raw);
    }
}
