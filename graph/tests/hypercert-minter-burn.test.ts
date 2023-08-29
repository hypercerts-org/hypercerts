import {
  handleTransferSingle,
  handleValueTransfer,
  handleBatchValueTransfer,
  handleTransferBatch,
} from "../src/hypercert-minter";
import {
  buildIDs,
  buildValues,
  buildZeroes,
  createBatchValueTransferEvent,
  createTransferBatchEvent,
  createTransferSingleEvent,
  createValueTransferEvent,
  getDefaultContractAddress,
  ZERO_ADDRESS,
  ZERO_TOKEN,
} from "./hypercert-minter-utils";
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  createMockedFunction,
  afterEach,
} from "matchstick-as/assembly/index";

export { handleTransferSingle, handleValueTransfer, handleBatchValueTransfer };

describe("Describe entity assertions", () => {
  beforeAll(() => {});

  afterEach(() => {
    clearStore();
  });

  test("TransferSingle and TransferValue for an existing token to zero address burns the fraction", () => {
    let from = Address.fromString("0x0000000000000000000000000000000000000001");

    let claimID = BigInt.fromI64(1);
    let fromID = BigInt.fromI64(0);
    let toID = BigInt.fromI64(1);
    let units = BigInt.fromI64(10000);

    // Create fraction token
    let valueTransferEvent = createValueTransferEvent(
      claimID,
      fromID,
      toID,
      units,
    );

    createMockedFunction(
      getDefaultContractAddress(),
      "ownerOf",
      "ownerOf(uint256):(address)",
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(toID)])
      .returns([ethereum.Value.fromAddress(from)]);

    createMockedFunction(
      getDefaultContractAddress(),
      "ownerOf",
      "ownerOf(uint256):(address)",
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(fromID)])
      .returns([ethereum.Value.fromAddress(from)]);

    handleValueTransfer(valueTransferEvent);

    let fractionId = getDefaultContractAddress().toHexString().concat("-1");

    assert.fieldEquals("ClaimToken", fractionId, "owner", from.toHexString());
    assert.fieldEquals("ClaimToken", fractionId, "units", "10000");

    // Handle 1155 transfer to zero address
    let transferSingleEvent = createTransferSingleEvent(
      from,
      from,
      ZERO_ADDRESS,
      BigInt.fromI64(1),
      BigInt.fromI64(1),
    );

    handleTransferSingle(transferSingleEvent);

    assert.fieldEquals(
      "ClaimToken",
      fractionId,
      "owner",
      ZERO_ADDRESS.toHexString(),
    );
    assert.fieldEquals("ClaimToken", fractionId, "units", "10000");

    // Handle hypercert units transfer
    let valueTransferEvent2 = createValueTransferEvent(
      claimID,
      toID,
      ZERO_TOKEN,
      units,
    );

    handleValueTransfer(valueTransferEvent2);

    assert.fieldEquals(
      "ClaimToken",
      fractionId,
      "owner",
      ZERO_ADDRESS.toHexString(),
    );
    assert.fieldEquals("ClaimToken", fractionId, "units", "0");
  });

  test("TransferBatch and BatchTransferValue for an existing token to zero address burns the fraction", () => {
    let from = Address.fromString("0x0000000000000000000000000000000000000001");

    let claimID = BigInt.fromI64(1);
    let fromID = BigInt.fromI64(0);
    let toID = BigInt.fromI64(1);
    let units = BigInt.fromI64(10000);

    // Create fraction token
    let valueTransferEvent = createBatchValueTransferEvent(
      [claimID],
      [fromID],
      [toID],
      [units],
    );

    createMockedFunction(
      getDefaultContractAddress(),
      "ownerOf",
      "ownerOf(uint256):(address)",
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(toID)])
      .returns([ethereum.Value.fromAddress(from)]);

    createMockedFunction(
      getDefaultContractAddress(),
      "ownerOf",
      "ownerOf(uint256):(address)",
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(fromID)])
      .returns([ethereum.Value.fromAddress(from)]);

    handleBatchValueTransfer(valueTransferEvent);

    let fractionId = getDefaultContractAddress().toHexString().concat("-1");

    assert.fieldEquals("ClaimToken", fractionId, "owner", from.toHexString());
    assert.fieldEquals("ClaimToken", fractionId, "units", "10000");

    // Handle 1155 transfer to zero address
    let transferBatchEvent = createTransferBatchEvent(
      from,
      from,
      ZERO_ADDRESS,
      [BigInt.fromI64(1)],
      [BigInt.fromI64(1)],
    );

    handleTransferBatch(transferBatchEvent);

    assert.fieldEquals(
      "ClaimToken",
      fractionId,
      "owner",
      ZERO_ADDRESS.toHexString(),
    );
    assert.fieldEquals("ClaimToken", fractionId, "units", "10000");

    // Handle hypercert units transfer
    let valueTransferEvent2 = createBatchValueTransferEvent(
      [claimID],
      [toID],
      [ZERO_TOKEN],
      [units],
    );

    handleBatchValueTransfer(valueTransferEvent2);

    assert.fieldEquals(
      "ClaimToken",
      fractionId,
      "owner",
      ZERO_ADDRESS.toHexString(),
    );
    assert.fieldEquals("ClaimToken", fractionId, "units", "0");
  });
});
