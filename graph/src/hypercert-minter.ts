import {
  AllowlistCreated as AllowlistCreatedEvent,
  ApprovalForAll as ApprovalForAllEvent,
  BatchValueTransfer,
  ClaimStored as ClaimStoredEvent,
  Initialized as InitializedEvent,
  LeafClaimed as LeafClaimedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent,
  ValueTransfer as ValueTransferEvent,
} from "../generated/HypercertMinter/HypercertMinter";
import {
  getID,
  getOrCreateAllowlist,
  getOrCreateClaim,
  getOrCreateClaimToken,
} from "./utils";
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { ClaimToken } from "../generated/schema";

const ZERO_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);
const ZERO_TOKEN = BigInt.fromI32(0);

export function handleAllowlistCreated(event: AllowlistCreatedEvent): void {
  let allowlist = getOrCreateAllowlist(
    event.params.tokenID,
    event.params.root,
    event.address
  );

  allowlist.save();
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {}

export function handleClaimStored(event: ClaimStoredEvent): void {
  let claim = getOrCreateClaim(
    event.params.claimID,
    event.address,
    event.block.timestamp
  );

  claim.uri = event.params.uri;
  claim.creator = event.transaction.from;
  claim.owner = event.transaction.from;
  claim.totalUnits = event.params.totalUnits;

  claim.save();
}

export function handleInitialized(event: InitializedEvent): void {}

export function handleLeafClaimed(event: LeafClaimedEvent): void {}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {}

export function handleTransferBatch(event: TransferBatchEvent): void {}

export function handleTransferSingle(event: TransferSingleEvent): void {
  let id = getID(event.params.id, event.address);
  let token = ClaimToken.load(id);

  if (!token) {
    log.debug("Transfered ClaimToken does not exist: {}", [id]);
    return;
  }

  token.owner = event.params.to;
  token.save();
}

export function handleURI(event: URIEvent): void {}

export function handleValueTransfer(event: ValueTransferEvent): void {
  log.debug("Received ValueTransferEvent claimID: {}", [
    event.params.claimID.toString(),
  ]);
  log.debug("Received ValueTransferEvent fromTokenID: {}", [
    event.params.fromTokenID.toString(),
  ]);
  log.debug("Received ValueTransferEvent toTokenID: {}", [
    event.params.toTokenID.toString(),
  ]);

  log.debug("Received ValueTransferEvent value: {}", [
    event.params.value.toString(),
  ]);

  let from = getOrCreateClaimToken(
    event.params.claimID,
    event.params.fromTokenID,
    event.address
  );
  let to = getOrCreateClaimToken(
    event.params.claimID,
    event.params.toTokenID,
    event.address
  );

  let value = event.params.value;

  log.debug("Got from: {}", [from.id]);
  log.debug("Got to: {}", [to.id]);
  log.debug("Transfering value: {}", [value.toString()]);

  // New mint
  if (from.tokenID.isZero() && !to.tokenID.isZero()) {
    to.units = value;
  }

  // Units transfer
  if (!from.tokenID.isZero() && !to.tokenID.isZero()) {
    from.units = from.units.minus(value);
    to.units = to.units.plus(value);
  }

  // Burn value
  if (!from.tokenID.isZero() && to.tokenID.isZero()) {
    from.units = from.units.minus(value);
  }

  log.debug("Saving from: {}", [from.id]);
  log.debug("Saving to: {}", [to.id]);

  from.save();
  to.save();
}

//TODO cleanup to nicer state handling
export function handleBatchValueTransfer(event: BatchValueTransfer): void {
  let claimIDs = event.params.claimIDs;
  let fromIDs = event.params.fromTokenIDs;
  let toIDs = event.params.toTokenIDs;
  let values = event.params.values;

  let size = claimIDs.length;

  for (let i = 0; i < size; i++) {
    let from = getOrCreateClaimToken(claimIDs[i], fromIDs[i], event.address);
    let to = getOrCreateClaimToken(claimIDs[i], toIDs[i], event.address);

    let value = values[i];

    log.debug("Got from: {}", [from.id]);
    log.debug("Got to: {}", [to.id]);

    // New mint
    if (from.tokenID.isZero() && !to.tokenID.isZero()) {
      to.units = value;
    }

    // Units transfer
    if (!from.tokenID.isZero() && !to.tokenID.isZero()) {
      from.units = from.units.minus(value);
      to.units = to.units.plus(value);
    }

    // Burn value
    if (!from.tokenID.isZero() && to.tokenID.isZero()) {
      from.units = from.units.minus(value);
    }

    log.debug("Saving from: {}", [from.id]);
    log.debug("Saving to: {}", [to.id]);

    from.save();
    to.save();
  }
}
