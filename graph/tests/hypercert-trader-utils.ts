import {
  AdminChanged,
  BeaconUpgraded,
  Initialized,
  OfferCancelled,
  OfferCreated,
  OwnershipTransferred,
  Paused,
  Trade,
  Unpaused,
  Upgraded,
} from "../generated/HypercertTrader/HypercertTrader";
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as";

export const DEFAULT_TRADER_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000001337",
);

export function createAdminChangedEvent(
  previousAdmin: Address,
  newAdmin: Address,
): AdminChanged {
  let adminChangedEvent = changetype<AdminChanged>(newMockEvent());

  adminChangedEvent.parameters = new Array();

  adminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdmin",
      ethereum.Value.fromAddress(previousAdmin),
    ),
  );
  adminChangedEvent.parameters.push(
    new ethereum.EventParam("newAdmin", ethereum.Value.fromAddress(newAdmin)),
  );

  return adminChangedEvent;
}

export function createBeaconUpgradedEvent(beacon: Address): BeaconUpgraded {
  let beaconUpgradedEvent = changetype<BeaconUpgraded>(newMockEvent());

  beaconUpgradedEvent.parameters = new Array();

  beaconUpgradedEvent.parameters.push(
    new ethereum.EventParam("beacon", ethereum.Value.fromAddress(beacon)),
  );

  return beaconUpgradedEvent;
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent());

  initializedEvent.parameters = new Array();

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version)),
    ),
  );

  return initializedEvent;
}

export function createOfferCancelledEvent(
  creator: Address,
  hypercertContract: Address,
  fractionID: BigInt,
  offerID: BigInt,
): OfferCancelled {
  let offerCancelledEvent = changetype<OfferCancelled>(newMockEvent());

  offerCancelledEvent.parameters = new Array();

  offerCancelledEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator)),
  );
  offerCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "hypercertContract",
      ethereum.Value.fromAddress(hypercertContract),
    ),
  );
  offerCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "fractionID",
      ethereum.Value.fromUnsignedBigInt(fractionID),
    ),
  );
  offerCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "offerID",
      ethereum.Value.fromUnsignedBigInt(offerID),
    ),
  );

  offerCancelledEvent.address = DEFAULT_TRADER_ADDRESS;

  return offerCancelledEvent;
}

export function createOfferCreatedEvent(
  offerer: Address,
  hypercertContract: Address,
  fractionID: BigInt,
  offerID: BigInt,
): OfferCreated {
  let offerCreatedEvent = changetype<OfferCreated>(newMockEvent());

  offerCreatedEvent.parameters = new Array();

  offerCreatedEvent.parameters.push(
    new ethereum.EventParam("offerer", ethereum.Value.fromAddress(offerer)),
  );
  offerCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "hypercertContract",
      ethereum.Value.fromAddress(hypercertContract),
    ),
  );
  offerCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "fractionID",
      ethereum.Value.fromUnsignedBigInt(fractionID),
    ),
  );
  offerCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "offerID",
      ethereum.Value.fromUnsignedBigInt(offerID),
    ),
  );

  offerCreatedEvent.address = DEFAULT_TRADER_ADDRESS;

  return offerCreatedEvent;
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address,
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent(),
  );

  ownershipTransferredEvent.parameters = new Array();

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner),
    ),
  );
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner)),
  );

  return ownershipTransferredEvent;
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent());

  pausedEvent.parameters = new Array();

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account)),
  );

  return pausedEvent;
}

export function createTradeEvent(
  seller: Address,
  buyer: Address,
  hypercertContract: Address,
  fractionID: BigInt,
  unitsBought: BigInt,
  buyToken: Address,
  tokenAmountPerUnit: BigInt,
  offerID: BigInt,
): Trade {
  let tradeEvent = changetype<Trade>(newMockEvent());

  tradeEvent.parameters = new Array();

  tradeEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller)),
  );
  tradeEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer)),
  );
  tradeEvent.parameters.push(
    new ethereum.EventParam(
      "hypercertContract",
      ethereum.Value.fromAddress(hypercertContract),
    ),
  );
  tradeEvent.parameters.push(
    new ethereum.EventParam(
      "fractionID",
      ethereum.Value.fromUnsignedBigInt(fractionID),
    ),
  );
  tradeEvent.parameters.push(
    new ethereum.EventParam(
      "unitsBought",
      ethereum.Value.fromUnsignedBigInt(unitsBought),
    ),
  );
  tradeEvent.parameters.push(
    new ethereum.EventParam("buyToken", ethereum.Value.fromAddress(buyToken)),
  );
  tradeEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAmountPerUnit",
      ethereum.Value.fromUnsignedBigInt(tokenAmountPerUnit),
    ),
  );
  tradeEvent.parameters.push(
    new ethereum.EventParam(
      "offerID",
      ethereum.Value.fromUnsignedBigInt(offerID),
    ),
  );

  tradeEvent.address = DEFAULT_TRADER_ADDRESS;

  return tradeEvent;
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent());

  unpausedEvent.parameters = new Array();

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account)),
  );

  return unpausedEvent;
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent());

  upgradedEvent.parameters = new Array();

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation),
    ),
  );

  return upgradedEvent;
}
