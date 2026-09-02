// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {QuiverSubscription} from "../src/QuiverSubscription.sol";
import {QuiverTreasury} from "../src/QuiverTreasury.sol";
import {QuiverBuyback} from "../src/QuiverBuyback.sol";
import {SiteRegistry} from "../src/SiteRegistry.sol";
import {QuiverFactory} from "../src/QuiverFactory.sol";

contract Deploy is Script {
    address constant PONS_FACTORY = 0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e;

    function run() external {
        address deployer = vm.envOr("DEPLOYER", msg.sender);
        address ponsFactory = vm.envOr("PONS_FACTORY", PONS_FACTORY);
        address quiverToken = vm.envOr("QUIVER_TOKEN", address(0));

        vm.startBroadcast();

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

        console2.log("Treasury", address(treasury));
        console2.log("Buyback", address(buyback));
        console2.log("Subscription", address(subscription));
        console2.log("Registry", address(registry));
        console2.log("Factory", address(factory));
    }
}
