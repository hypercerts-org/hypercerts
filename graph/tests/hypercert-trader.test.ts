import { handleOfferCreated } from "../src/hypercert-trader";
import {
  DEFAULT_TRADER_ADDRESS,
  createOfferCreatedEvent,
} from "./hypercert-trader-utils";
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  createMockedFunction,
} from "matchstick-as/assembly/index";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    createMockedFunction(
      DEFAULT_TRADER_ADDRESS,
      "offers",
      "offers(uint256):(address,address,uint256,uint256,uint256,uint256,uint8,uint8)",
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1))])
      .returns([
        ethereum.Value.fromAddress(
          Address.fromString("0x0000000000000000000000000000000000000003"),
        ),
        ethereum.Value.fromAddress(
          Address.fromString("0x0000000000000000000000000000000000000004"),
        ),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1)),
      ]);
  });

  afterAll(() => {
    clearStore();
  });

  test("Offer created and stored", () => {
    assert.entityCount("Offer", 0);

    // Create an OfferCreated event
    let offerCreatedEvent = createOfferCreatedEvent(
      Address.fromString("0x0000000000000000000000000000000000000001"),
      Address.fromString("0x0000000000000000000000000000000000000002"),
      BigInt.fromI32(1),
      BigInt.fromI32(1),
    );

    handleOfferCreated(offerCreatedEvent);

    assert.entityCount("Offer", 1);
  });
});
