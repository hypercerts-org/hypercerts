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
import { HypercertMetadata as HypercertMetadataTemplate } from "../generated/templates";
import { ClaimToken } from "../generated/schema";
import {
  ZERO_ADDRESS,
  getID,
  getOrCreateAllowlist,
  getOrCreateClaim,
  getOrCreateClaimToken,
} from "./utils";
import { log } from "@graphprotocol/graph-ts";

export function handleAllowlistCreated(event: AllowlistCreatedEvent): void {
  const allowlist = getOrCreateAllowlist(
    event.params.tokenID,
    event.params.root,
    event.address,
  );

  allowlist.save();
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function handleApprovalForAll(_event: ApprovalForAllEvent): void {}

export function handleClaimStored(event: ClaimStoredEvent): void {
  log.debug("Creating Claim for claimID: {}", [
    event.params.claimID.toString(),
  ]);

  const claim = getOrCreateClaim(
    event.params.claimID,
    event.address,
    event.block.timestamp,
  );

  claim.uri = event.params.uri;

  log.debug("Creating HypercertMetadataTemplate for uri: {}", [
    event.params.uri,
  ]);

  const metadataUri = `${event.params.uri}/data.json`;
  claim.metaData = metadataUri;
  HypercertMetadataTemplate.create(metadataUri);

  claim.creator = event.transaction.from;
  claim.owner = event.transaction.from;
  claim.totalUnits = event.params.totalUnits;

  claim.metaData = event.params.uri;

  claim.save();
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function handleInitialized(_: InitializedEvent): void {}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function handleLeafClaimed(_: LeafClaimedEvent): void {}

export function handleOwnershipTransferred(
  _event: OwnershipTransferredEvent,
  // eslint-disable-next-line @typescript-eslint/no-empty-function,
): void {}

export function handleTransferBatch(event: TransferBatchEvent): void {
  const ids = event.params.ids;
  const size = ids.length;

  for (let i = 0; i < size; i++) {
    const id = getID(ids[i], event.address);
    const token = ClaimToken.load(id);

    if (!token) {
      log.debug("Transfered ClaimToken does not exist: {}", [id]);
      return;
    }

    token.owner = event.params.to;
    token.save();
  }
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  const id = getID(event.params.id, event.address);
  const token = ClaimToken.load(id);

  if (!token) {
    log.debug("Transfered ClaimToken does not exist: {}", [id]);
    return;
  }

  token.owner = event.params.to;
  token.save();
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function handleURI(_event: URIEvent): void {}

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

  const from = getOrCreateClaimToken(
    event.params.claimID,
    event.params.fromTokenID,
    event.address,
  );
  const to = getOrCreateClaimToken(
    event.params.claimID,
    event.params.toTokenID,
    event.address,
  );

  const value = event.params.value;

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
    from.owner = ZERO_ADDRESS;
  }

  log.debug("Saving from: {}", [from.id]);
  log.debug("Saving to: {}", [to.id]);

  from.save();
  to.save();
}

//TODO cleanup to nicer state handling
export function handleBatchValueTransfer(event: BatchValueTransfer): void {
  const claimIDs = event.params.claimIDs;
  const fromIDs = event.params.fromTokenIDs;
  const toIDs = event.params.toTokenIDs;
  const values = event.params.values;
  const contractAddress = event.address;

  const size = claimIDs.length;

  for (let i = 0; i < size; i++) {
    const from = getOrCreateClaimToken(
      claimIDs[i],
      fromIDs[i],
      contractAddress,
    );
    const to = getOrCreateClaimToken(claimIDs[i], toIDs[i], contractAddress);

    const value = values[i];

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
      from.owner = ZERO_ADDRESS;
    }

    log.debug("Saving from: {}", [from.id]);
    log.debug("Saving to: {}", [to.id]);

    from.save();
    to.save();
  }
}
