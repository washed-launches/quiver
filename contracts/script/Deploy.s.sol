// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {QuiverSubscription} from "../src/QuiverSubscription.sol";
import {QuiverTreasury} from "../src/QuiverTreasury.sol";
import {QuiverBuyback} from "../src/QuiverBuyback.sol";
import {SiteRegistry} from "../src/SiteRegistry.sol";
import {QuiverFactory} from "../src/QuiverFactory.sol";

/// @notice Deploys the QUIVER stack to Robinhood Chain mainnet (4663).
contract Deploy is Script {
    address constant PONS_FACTORY = 0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e;
    uint256 constant ROBINHOOD_MAINNET = 4663;

    function run() external {
        require(block.chainid == ROBINHOOD_MAINNET, "not robinhood mainnet");

        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);
        address ponsFactory = vm.envOr("PONS_FACTORY", PONS_FACTORY);
        address quiverToken = vm.envOr("QUIVER_TOKEN", address(0));

        vm.startBroadcast(pk);

        QuiverTreasury treasury = new QuiverTreasury(deployer);
        QuiverBuyback buyback = new QuiverBuyback(deployer, ponsFactory);
        QuiverSubscription subscription = new QuiverSubscription(deployer);
        SiteRegistry registry = new SiteRegistry(deployer);
        QuiverFactory factory = new QuiverFactory(deployer, address(subscription), address(registry));

        buyback.setSubscription(address(subscription));
        buyback.setTreasury(address(treasury));
        subscription.setBuyback(address(buyback));
        registry.setFactory(address(factory));

        if (quiverToken != address(0)) {
            buyback.setQuiverToken(quiverToken);
            treasury.setQuiverToken(quiverToken);
        }

        vm.stopBroadcast();

        console2.log("chainId", block.chainid);
        console2.log("deployer", deployer);
        console2.log("Treasury", address(treasury));
        console2.log("Buyback", address(buyback));
        console2.log("Subscription", address(subscription));
        console2.log("Registry", address(registry));
        console2.log("Factory", address(factory));

        string memory obj = "deploy";
        vm.serializeUint(obj, "chainId", block.chainid);
        vm.serializeAddress(obj, "deployer", deployer);
        vm.serializeAddress(obj, "ponsFactory", ponsFactory);
        vm.serializeAddress(obj, "quiverToken", quiverToken);
        vm.serializeAddress(obj, "treasury", address(treasury));
        vm.serializeAddress(obj, "buyback", address(buyback));
        vm.serializeAddress(obj, "subscription", address(subscription));
        vm.serializeAddress(obj, "registry", address(registry));
        string memory json = vm.serializeAddress(obj, "factory", address(factory));
        vm.writeJson(json, "deployments/robinhood.json");
    }
}
