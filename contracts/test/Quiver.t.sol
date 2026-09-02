// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {QuiverSubscription} from "../src/QuiverSubscription.sol";
import {QuiverTreasury} from "../src/QuiverTreasury.sol";
import {QuiverBuyback} from "../src/QuiverBuyback.sol";
import {SiteRegistry} from "../src/SiteRegistry.sol";
import {QuiverFactory} from "../src/QuiverFactory.sol";
import {BondingCurve} from "../src/BondingCurve.sol";
import {SiteToken} from "../src/SiteToken.sol";
import {MockPonsCurve, MockPonsFactory} from "./mocks/MockPons.sol";

contract QuiverTest is Test {
    address owner = address(0xA11CE);
    address alice = address(0xB0B);
    address bob = address(0xCAFE);

    MockPonsFactory ponsFactory;
    MockPonsCurve ponsCurve;
    SiteToken quiverToken;

    QuiverTreasury treasury;
    QuiverBuyback buyback;
    QuiverSubscription subscription;
    SiteRegistry registry;
    QuiverFactory factory;

    function setUp() public {
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
        vm.deal(owner, 10 ether);

        ponsFactory = new MockPonsFactory();
        ponsCurve = new MockPonsCurve();

        vm.startPrank(owner);
        treasury = new QuiverTreasury(owner);
        buyback = new QuiverBuyback(owner, address(ponsFactory));
        subscription = new QuiverSubscription(owner);
        registry = new SiteRegistry(owner);
        factory = new QuiverFactory(owner, address(subscription), address(registry));

        buyback.setSubscription(address(subscription));
        buyback.setTreasury(address(treasury));
        subscription.setBuyback(address(buyback));
        registry.setFactory(address(factory));

        quiverToken = new SiteToken("QUIVER", "QUIVER", 1_000_000 ether, address(ponsCurve));
        ponsCurve.setToken(address(quiverToken));
        ponsFactory.setLaunch(address(quiverToken), address(ponsCurve), 0, true);
        buyback.setQuiverToken(address(quiverToken));
        treasury.setQuiverToken(address(quiverToken));
        vm.stopPrank();
    }

    function _subscribe(address who, uint256 planId) internal {
        (uint256 price,,) = subscription.plans(planId);
        vm.prank(who);
        subscription.subscribe{value: price}(planId);
    }

    function testSubscribeGatesCreate() public {
        vm.prank(alice);
        vm.expectRevert(QuiverFactory.NotSubscribed.selector);
        factory.create("Moss", "MOSS", "moss");

        _subscribe(alice, 0);
        assertTrue(subscription.isActive(alice));

        vm.prank(alice);
        (address token, address curve) = factory.create("Moss", "MOSS", "moss");
        assertTrue(token != address(0));
        assertTrue(curve != address(0));

        SiteRegistry.Site memory site = registry.getBySlug("MOSS");
        assertEq(site.token, token);
        assertEq(site.creator, alice);
        assertEq(site.slug, "moss");
    }

    function testSlugUniqueness() public {
        _subscribe(alice, 0);
        _subscribe(bob, 0);
        vm.prank(alice);
        factory.create("Moss", "MOSS", "moss");
        vm.prank(bob);
        vm.expectRevert(SiteRegistry.SlugTaken.selector);
        factory.create("Other", "OTH", "moss");
    }

    function testProtocolFeeIsZero() public {
        _subscribe(alice, 0);
        vm.prank(alice);
        (, address curveAddr) = factory.create("Moss", "MOSS", "moss");
        assertEq(BondingCurve(payable(curveAddr)).PROTOCOL_FEE_BPS(), 0);
    }

    function testBuySellRoundTrip() public {
        _subscribe(alice, 0);
        vm.prank(alice);
        (address tokenAddr, address curveAddr) = factory.create("Moss", "MOSS", "moss");
        BondingCurve curve = BondingCurve(payable(curveAddr));
        SiteToken token = SiteToken(tokenAddr);

        uint256 quoteIn = 1 ether;
        uint256 expected = curve.quoteBuy(quoteIn);
        vm.prank(bob);
        uint256 tokensOut = curve.buy{value: quoteIn}(expected, bob);
        assertEq(tokensOut, expected);
        assertEq(token.balanceOf(bob), tokensOut);
        assertEq(curve.realQuote(), quoteIn);

        vm.startPrank(bob);
        token.approve(address(curve), tokensOut);
        uint256 expectedEth = curve.quoteSell(tokensOut);
        uint256 before = bob.balance;
        uint256 ethOut = curve.sell(tokensOut, expectedEth, bob);
        vm.stopPrank();

        assertEq(ethOut, expectedEth);
        assertEq(ethOut, quoteIn);
        assertEq(bob.balance, before + ethOut);
        assertEq(curve.realQuote(), 0);
        assertEq(token.balanceOf(address(curve)), token.totalSupply());
    }

    function testZeroProtocolTakeInvariant(uint96 quoteIn) public {
        vm.assume(quoteIn > 0.0001 ether && quoteIn < 20 ether);
        _subscribe(alice, 0);
        vm.prank(alice);
        (, address curveAddr) = factory.create("Moss", "MOSS", "moss");
        BondingCurve curve = BondingCurve(payable(curveAddr));

        uint256 factoryBefore = address(factory).balance;
        uint256 subBefore = address(subscription).balance;
        vm.prank(bob);
        curve.buy{value: quoteIn}(0, bob);
        assertEq(address(factory).balance, factoryBefore);
        assertEq(address(subscription).balance, subBefore);
        assertEq(address(curve).balance, quoteIn);
    }

    function testSubscribeForwardsToBuyback() public {
        uint256 before = quiverToken.balanceOf(address(treasury));
        _subscribe(alice, 0);
        assertGt(quiverToken.balanceOf(address(treasury)), before);
        assertEq(address(buyback).balance, 0);
    }

    function testBuybackHoldsWhenTokenUnset() public {
        QuiverTreasury t2 = new QuiverTreasury(owner);
        QuiverBuyback b2 = new QuiverBuyback(owner, address(ponsFactory));
        QuiverSubscription s2 = new QuiverSubscription(owner);
        vm.startPrank(owner);
        b2.setSubscription(address(s2));
        b2.setTreasury(address(t2));
        s2.setBuyback(address(b2));
        vm.stopPrank();

        (uint256 price,,) = s2.plans(0);
        vm.prank(alice);
        s2.subscribe{value: price}(0);
        assertEq(address(b2).balance, price);
    }

    function testBuybackHoldsWhenGraduated() public {
        vm.prank(owner);
        ponsFactory.setLaunch(address(quiverToken), address(ponsCurve), 2, true);

        QuiverTreasury t2 = new QuiverTreasury(owner);
        QuiverBuyback b2 = new QuiverBuyback(owner, address(ponsFactory));
        QuiverSubscription s2 = new QuiverSubscription(owner);
        vm.startPrank(owner);
        b2.setSubscription(address(s2));
        b2.setTreasury(address(t2));
        b2.setQuiverToken(address(quiverToken));
        s2.setBuyback(address(b2));
        vm.stopPrank();

        (uint256 price,,) = s2.plans(0);
        vm.prank(alice);
        s2.subscribe{value: price}(0);
        assertEq(address(b2).balance, price);
    }

    function testYearlyPlan() public {
        _subscribe(alice, 1);
        assertTrue(subscription.isActive(alice));
        assertEq(subscription.expiresAt(alice), block.timestamp + 365 days);
    }
}
