import { handleOfferCreated } from "../src/hypercert-trader";
import { ZERO_ADDRESS } from "../src/utils";
import {
  DEFAULT_TRADER_ADDRESS,
  createOfferCreatedEvent,
} from "./hypercert-trader-utils";
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
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
    let acceptedToken: Array<ethereum.Value> = [
      ethereum.Value.fromAddress(
        Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"),
      ),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1)),
    ];

    let tuple = changetype<ethereum.Tuple>(acceptedToken);
    let tupleValue = ethereum.Value.fromTupleArray([tuple]);

    const returnValues = [
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
      ethereum.Value.fromTupleArray([tuple]),
    ];

    let returnValueTuple = changetype<ethereum.Tuple>(returnValues);
    let returnValue = ethereum.Value.fromTuple(returnValueTuple);

    createMockedFunction(
      DEFAULT_TRADER_ADDRESS,
      "getOffer",
      "getOffer(uint256):((address,address,uint256,uint256,uint256,uint256,uint8,uint8,(address,uint256)[]))",
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1))])
      .returns([returnValue]);
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
