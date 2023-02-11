import { newMockEvent } from "matchstick-as";
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  AllowlistCreated,
  BatchValueTransfer,
  ClaimStored,
  LeafClaimed,
  TransferBatch,
  TransferSingle,
  URI,
  ValueTransfer,
} from "../generated/HypercertMinter/HypercertMinter";

export function getDefaultContractAddress(): Address {
  return Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7");
}

export function buildZeroes(size: BigInt): BigInt[] {
  let array: BigInt[] = [];
  for (let i = 0; i < size.toI32(); i++) {
    let value = BigInt.zero();

    array.push(value);
  }

  return array;
}

export function buildIDs(
  size: BigInt,
  start: BigInt = BigInt.zero()
): BigInt[] {
  let array: BigInt[] = [];
  for (let i = 0; i < size.toI32(); i++) {
    let index = start.plus(BigInt.fromI64(i)).plus(BigInt.fromI64(1));
    array.push(index);
  }

  return array;
}

export function buildValues(size: BigInt): BigInt[] {
  let array: BigInt[] = [];
  for (let i = 0; i < size.toI32(); i++) {
    let value = BigInt.fromI64(100)
      .plus(BigInt.fromI64(i))
      .plus(BigInt.fromI64(100));

    array.push(value);
  }

  return array;
}

export function createAllowlistCreatedEvent(
  tokenID: BigInt,
  root: Bytes
): AllowlistCreated {
  let mockEvent = newMockEvent();
  let parameters: ethereum.EventParam[] = new Array();

  parameters = new Array();

  parameters.push(
    new ethereum.EventParam(
      "tokenID",
      ethereum.Value.fromUnsignedBigInt(tokenID)
    )
  );
  parameters.push(
    new ethereum.EventParam("root", ethereum.Value.fromFixedBytes(root))
  );

  let allowlistCreatedEvent = new AllowlistCreated(
    getDefaultContractAddress(),
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return allowlistCreatedEvent;
}

export function createClaimStoredEvent(
  claimID: BigInt,
  uri: string,
  totalUnits: BigInt
): ClaimStored {
  let mockEvent = newMockEvent();
  let parameters: ethereum.EventParam[] = new Array();

  parameters.push(
    new ethereum.EventParam(
      "claimID",
      ethereum.Value.fromUnsignedBigInt(claimID)
    )
  );
  parameters.push(
    new ethereum.EventParam("uri", ethereum.Value.fromString(uri))
  );

  parameters.push(
    new ethereum.EventParam(
      "totalUnits",
      ethereum.Value.fromUnsignedBigInt(totalUnits)
    )
  );

  let claimStoredEvent = new ClaimStored(
    getDefaultContractAddress(),
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return claimStoredEvent;
}

export function createLeafClaimedEvent(
  tokenID: BigInt,
  leaf: Bytes
): LeafClaimed {
  let leafClaimedEvent = changetype<LeafClaimed>(newMockEvent());

  leafClaimedEvent.parameters = new Array();

  leafClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenID",
      ethereum.Value.fromUnsignedBigInt(tokenID)
    )
  );
  leafClaimedEvent.parameters.push(
    new ethereum.EventParam("leaf", ethereum.Value.fromFixedBytes(leaf))
  );

  return leafClaimedEvent;
}

export function createTransferBatchEvent(
  operator: Address,
  from: Address,
  to: Address,
  ids: Array<BigInt>,
  values: Array<BigInt>
): TransferBatch {
  let transferBatchEvent = changetype<TransferBatch>(newMockEvent());

  transferBatchEvent.parameters = new Array();

  transferBatchEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  );
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  );
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  );
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("ids", ethereum.Value.fromUnsignedBigIntArray(ids))
  );
  transferBatchEvent.parameters.push(
    new ethereum.EventParam(
      "values",
      ethereum.Value.fromUnsignedBigIntArray(values)
    )
  );

  return transferBatchEvent;
}

export function createTransferSingleEvent(
  operator: Address,
  from: Address,
  to: Address,
  id: BigInt,
  value: BigInt
): TransferSingle {
  let mockEvent = newMockEvent();
  let parameters: ethereum.EventParam[] = new Array();

  parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  );
  parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  );
  parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  );
  parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  );
  parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  );

  let transferSingleEvent = new TransferSingle(
    getDefaultContractAddress(),
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return transferSingleEvent;
}

export function createURIEvent(value: string, id: BigInt): URI {
  let uriEvent = changetype<URI>(newMockEvent());

  uriEvent.parameters = new Array();

  uriEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromString(value))
  );
  uriEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  );

  return uriEvent;
}

export function createHypercertMinterUpgradedEvent(
  implementation: Address
): HypercertMinterUpgraded {
  let hypercertMinterUpgradedEvent = changetype<HypercertMinterUpgraded>(
    newMockEvent()
  );

  hypercertMinterUpgradedEvent.parameters = new Array();

  hypercertMinterUpgradedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  );

  return hypercertMinterUpgradedEvent;
}

export function createValueTransferEvent(
  claimID: BigInt,
  fromTokenID: BigInt,
  toTokenID: BigInt,
  value: BigInt
): ValueTransfer {
  let mockEvent = newMockEvent();
  let parameters: ethereum.EventParam[] = new Array();

  parameters.push(
    new ethereum.EventParam(
      "claimID",
      ethereum.Value.fromUnsignedBigInt(claimID)
    )
  );

  parameters.push(
    new ethereum.EventParam(
      "fromTokenID",
      ethereum.Value.fromUnsignedBigInt(fromTokenID)
    )
  );
  parameters.push(
    new ethereum.EventParam(
      "toTokenID",
      ethereum.Value.fromUnsignedBigInt(toTokenID)
    )
  );
  parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  );

  let valueTransferEvent = new ValueTransfer(
    getDefaultContractAddress(),
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return valueTransferEvent;
}

export function createBatchValueTransferEvent(
  claimIDs: BigInt[],
  fromTokenIDs: BigInt[],
  toTokenIDs: BigInt[],
  values: BigInt[]
): BatchValueTransfer {
  let mockEvent = newMockEvent();
  let parameters: ethereum.EventParam[] = new Array();

  parameters.push(
    new ethereum.EventParam(
      "claimIDs",
      ethereum.Value.fromUnsignedBigIntArray(claimIDs)
    )
  );
  parameters.push(
    new ethereum.EventParam(
      "fromTokenIDs",
      ethereum.Value.fromUnsignedBigIntArray(fromTokenIDs)
    )
  );
  parameters.push(
    new ethereum.EventParam(
      "toTokenIDs",
      ethereum.Value.fromUnsignedBigIntArray(toTokenIDs)
    )
  );
  parameters.push(
    new ethereum.EventParam(
      "values",
      ethereum.Value.fromUnsignedBigIntArray(values)
    )
  );

  let batchValueTransferEvent = new BatchValueTransfer(
    getDefaultContractAddress(),
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return batchValueTransferEvent;
}
