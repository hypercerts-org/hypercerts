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
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  handleTransferSingle,
  handleValueTransfer,
  handleBatchValueTransfer,
} from "../src/hypercert-minter";
import {
  buildIDs,
  buildValues,
  buildZeroes,
  createBatchValueTransferEvent,
  createTransferSingleEvent,
  createValueTransferEvent,
  getDefaultContractAddress,
} from "./hypercert-minter-utils";

export { handleTransferSingle, handleValueTransfer, handleBatchValueTransfer };

describe("Describe entity assertions", () => {
  beforeAll(() => {});

  afterEach(() => {
    clearStore();
  });

  test("TransferSingle for a non-existent token does not generate a claim fraction entity", () => {
    let from = Address.fromString("0x0000000000000000000000000000000000000001");
    let to = Address.fromString("0x0000000000000000000000000000000000000002");
    let operator = Address.fromString(
      "0x0000000000000000000000000000000000000003"
    );

    let transferSingleEvent = createTransferSingleEvent(
      operator,
      from,
      to,
      BigInt.fromI64(1),
      BigInt.fromI64(1)
    );

    handleTransferSingle(transferSingleEvent);

    assert.entityCount("Allowlist", 0);
    assert.entityCount("Claim", 0);
    assert.entityCount("ClaimToken", 0);
  });

  test("TransferSingle for an existing token updates the ownership", () => {
    let from = Address.fromString("0x0000000000000000000000000000000000000001");
    let to = Address.fromString("0x0000000000000000000000000000000000000002");

    let claimID = BigInt.fromI64(1);
    let fromID = BigInt.fromI64(0);
    let toID = BigInt.fromI64(1);
    let units = BigInt.fromI64(10000);

    let valueTransferEvent = createValueTransferEvent(
      claimID,
      fromID,
      toID,
      units
    );

    createMockedFunction(
      getDefaultContractAddress(),
      "ownerOf",
      "ownerOf(uint256):(address)"
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(toID)])
      .returns([ethereum.Value.fromAddress(from)]);

    createMockedFunction(
      getDefaultContractAddress(),
      "ownerOf",
      "ownerOf(uint256):(address)"
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(fromID)])
      .returns([ethereum.Value.fromAddress(from)]);

    handleValueTransfer(valueTransferEvent);

    let fractionId = getDefaultContractAddress()
      .toHexString()
      .concat("-1");

    assert.fieldEquals("ClaimToken", fractionId, "owner", from.toHexString());

    let transferSingleEvent = createTransferSingleEvent(
      from,
      from,
      to,
      BigInt.fromI64(1),
      BigInt.fromI64(1)
    );

    handleTransferSingle(transferSingleEvent);
    assert.fieldEquals("ClaimToken", fractionId, "owner", to.toHexString());
  });

  test("TransferValue for a non-existent token generates a claim fraction entity AND no other entities", () => {
    assert.entityCount("Allowlist", 0);
    assert.entityCount("Claim", 0);
    assert.entityCount("ClaimToken", 0);

    let from = Address.fromString("0x0000000000000000000000000000000000000001");
    let claimID = BigInt.fromI64(1);
    let fromID = BigInt.fromI64(0);
    let toID = BigInt.fromI64(1);
    let units = BigInt.fromI64(10000);

    let valueTransferEvent = createValueTransferEvent(
      claimID,
      fromID,
      toID,
      units
    );

    createMockedFunction(
      getDefaultContractAddress(),
      "ownerOf",
      "ownerOf(uint256):(address)"
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(toID)])
      .returns([ethereum.Value.fromAddress(from)]);

    createMockedFunction(
      getDefaultContractAddress(),
      "ownerOf",
      "ownerOf(uint256):(address)"
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(fromID)])
      .returns([ethereum.Value.fromAddress(from)]);

    handleValueTransfer(valueTransferEvent);

    assert.entityCount("Allowlist", 0);
    assert.entityCount("Claim", 0);
    //TODO also generates claim base token, should this only mint 1 fraction?
    assert.entityCount("ClaimToken", 2);

    let fractionId = getDefaultContractAddress()
      .toHexString()
      .concat("-1");

    assert.fieldEquals("ClaimToken", fractionId, "tokenID", "1");
    assert.fieldEquals(
      "ClaimToken",
      fractionId,
      "claim",
      getDefaultContractAddress()
        .toHexString()
        .concat("-1")
    );
    assert.fieldEquals("ClaimToken", fractionId, "owner", from.toHexString());
    assert.fieldEquals("ClaimToken", fractionId, "units", "10000");
  });

  test("TransferValue between two tokens updates the value balance", () => {
    assert.entityCount("ClaimToken", 0);

    let from = Address.fromString("0x0000000000000000000000000000000000000001");
    let claimID = BigInt.fromI64(1);
    let fromID = BigInt.fromI64(0);
    let toID = BigInt.fromI64(1);
    let units = BigInt.fromI64(10000);

    let valueTransferEvent = createValueTransferEvent(
      claimID,
      fromID,
      toID,
      units
    );

    createMockedFunction(
      getDefaultContractAddress(),
      "ownerOf",
      "ownerOf(uint256):(address)"
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(toID)])
      .returns([ethereum.Value.fromAddress(from)]);

    createMockedFunction(
      getDefaultContractAddress(),
      "ownerOf",
      "ownerOf(uint256):(address)"
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(fromID)])
      .returns([ethereum.Value.fromAddress(from)]);

    handleValueTransfer(valueTransferEvent);

    assert.entityCount("ClaimToken", 2);

    let fractionIdZero = getDefaultContractAddress()
      .toHexString()
      .concat("-0");

    let fractionIdOne = getDefaultContractAddress()
      .toHexString()
      .concat("-1");

    assert.fieldEquals("ClaimToken", fractionIdZero, "tokenID", "0");
    assert.fieldEquals("ClaimToken", fractionIdZero, "units", "0");
    assert.fieldEquals("ClaimToken", fractionIdOne, "tokenID", "1");
    assert.fieldEquals("ClaimToken", fractionIdOne, "units", "10000");

    let newTokenID = BigInt.fromI64(2);

    valueTransferEvent = createValueTransferEvent(
      claimID,
      toID,
      newTokenID,
      units
    );

    let fractionIdTwo = getDefaultContractAddress()
      .toHexString()
      .concat("-2");

    createMockedFunction(
      getDefaultContractAddress(),
      "ownerOf",
      "ownerOf(uint256):(address)"
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(newTokenID)])
      .returns([ethereum.Value.fromAddress(from)]);

    handleValueTransfer(valueTransferEvent);

    assert.fieldEquals("ClaimToken", fractionIdZero, "tokenID", "0");
    assert.fieldEquals("ClaimToken", fractionIdZero, "units", "0");
    assert.fieldEquals("ClaimToken", fractionIdOne, "tokenID", "1");
    assert.fieldEquals("ClaimToken", fractionIdOne, "units", "0");
    assert.fieldEquals("ClaimToken", fractionIdTwo, "tokenID", "2");
    assert.fieldEquals("ClaimToken", fractionIdTwo, "units", "10000");
  });

  test("BatchTransferValue for non-existent tokens generates the claim tokens AND no other entities", () => {
    assert.entityCount("Allowlist", 0);
    assert.entityCount("Claim", 0);
    assert.entityCount("ClaimToken", 0);

    let from = Address.fromString("0x0000000000000000000000000000000000000001");
    let size = BigInt.fromI64(5);
    let claimIDs = buildIDs(size);
    let fromIDs = buildZeroes(size);
    let toIDs = buildIDs(size);
    let values = buildValues(size);

    let batchValueTransferEvent = createBatchValueTransferEvent(
      claimIDs,
      fromIDs,
      toIDs,
      values
    );

    for (let i = 0; i < size.toI64(); i++) {
      createMockedFunction(
        getDefaultContractAddress(),
        "ownerOf",
        "ownerOf(uint256):(address)"
      )
        .withArgs([ethereum.Value.fromUnsignedBigInt(toIDs[i])])
        .returns([ethereum.Value.fromAddress(from)]);

      createMockedFunction(
        getDefaultContractAddress(),
        "ownerOf",
        "ownerOf(uint256):(address)"
      )
        .withArgs([ethereum.Value.fromUnsignedBigInt(fromIDs[i])])
        .returns([ethereum.Value.fromAddress(from)]);
    }

    handleBatchValueTransfer(batchValueTransferEvent);

    assert.entityCount("Allowlist", 0);
    assert.entityCount("Claim", 0);
    //TODO also build 0 token..
    assert.entityCount("ClaimToken", 6);

    let fractionId = getDefaultContractAddress()
      .toHexString()
      .concat("-1");

    assert.fieldEquals("ClaimToken", fractionId, "tokenID", "1");
    assert.fieldEquals(
      "ClaimToken",
      fractionId,
      "claim",
      getDefaultContractAddress()
        .toHexString()
        .concat("-1")
    );
    assert.fieldEquals("ClaimToken", fractionId, "owner", from.toHexString());
    assert.fieldEquals("ClaimToken", fractionId, "units", "200"); //function of buildValues (100 + i * 100)
  });
});
