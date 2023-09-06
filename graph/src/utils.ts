import { HypercertMinter } from "../generated/HypercertMinter/HypercertMinter";
import { HypercertTrader } from "../generated/HypercertTrader/HypercertTrader";
import {
  AcceptedToken,
  Allowlist,
  Claim,
  ClaimToken,
  Offer,
  Token,
} from "../generated/schema";
import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";

export const ZERO_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000",
);

export function getID(tokenID: BigInt, contract: Address): string {
  return contract.toHexString().concat("-".concat(tokenID.toString()));
}

export function getOrCreateAllowlist(
  claimID: BigInt,
  root: Bytes,
  contract: Address,
): Allowlist {
  const id = getID(claimID, contract);
  let list = Allowlist.load(id);

  log.debug("Created allowlistID: {}", [id]);

  if (list == null) {
    list = new Allowlist(id);
    list.root = root;
    list.claim = getID(claimID, contract);
    list.save();
  }

  return list;
}

export function getOrCreateClaim(
  claimID: BigInt,
  contract: Address,
  timestamp: BigInt,
): Claim {
  const id = getID(claimID, contract);
  let claim = Claim.load(id);

  log.debug("Created claimID: {}", [id]);

  if (claim == null) {
    claim = new Claim(id);
    const list = Allowlist.load(id);

    if (timestamp) {
      claim.creation = timestamp;
    }

    if (list) {
      claim.allowlist = list.id;
    }
    claim.tokenID = claimID;
    claim.contract = contract.toHexString();
    claim.save();
  }

  return claim;
}

export function getOrCreateClaimToken(
  claimID: BigInt,
  tokenID: BigInt,
  contract: Address,
): ClaimToken {
  const minterContract = HypercertMinter.bind(contract);

  const id = getID(tokenID, contract);
  let fraction = ClaimToken.load(id);

  if (fraction == null) {
    log.debug("Creating claimToken: {}", [id]);

    const owner = minterContract.ownerOf(tokenID);

    fraction = new ClaimToken(id);
    fraction.owner = owner;
    fraction.claim = getID(claimID, contract);
    fraction.tokenID = tokenID;
    fraction.units = BigInt.fromI32(0);
    fraction.save();
  }

  return fraction;
}

export function getOrCreateToken(token: Address): Token {
  const _tokenID = token.toHexString();
  let _token = Token.load(_tokenID);

  if (_token == null) {
    _token = new Token(_tokenID);
    //TODO get token name
    _token.name = "Native";
    _token.save();
  }

  return _token;
}

export function getOrCreateAcceptedToken(
  offerID: BigInt,
  token: Address,
  minimumAmountPerUnit: BigInt,
): AcceptedToken {
  const _acceptedTokenID = offerID
    .toHexString()
    .concat("-".concat(token.toHexString()));
  let acceptedToken = AcceptedToken.load(_acceptedTokenID);

  if (acceptedToken == null) {
    acceptedToken = new AcceptedToken(_acceptedTokenID);
    acceptedToken.token = getOrCreateToken(token).id;
    acceptedToken.minimumAmountPerUnit = minimumAmountPerUnit;
    acceptedToken.accepted = true;
    acceptedToken.save();
  }

  log.debug("Returning acceptedToken: {}", [_acceptedTokenID]);
  return acceptedToken;
}

export function getOrCreateOffer(
  hypercertContract: Address,
  traderContract: Address,
  fractionID: BigInt,
  offerID: BigInt,
): Offer {
  const _traderContract = HypercertTrader.bind(traderContract);

  const _fractionID = getID(fractionID, hypercertContract);
  const _offerID = fractionID
    .toHexString()
    .concat("-".concat(offerID.toString()));
  let offer = Offer.load(_offerID);

  if (offer == null) {
    const offerOnChain = _traderContract.getOffer(offerID);
    offer = new Offer(_offerID);
    offer.fractionID = _fractionID;
    offer.unitsAvailable = offerOnChain.unitsAvailable;
    offer.minUnitsPerTrade = offerOnChain.minUnitsPerTrade;
    offer.maxUnitsPerTrade = offerOnChain.maxUnitsPerTrade;
    offer.acceptedTokens = [];
    offer.status = "Open";

    for (let i = 0; i < offerOnChain.acceptedTokens.length; i++) {
      const _acceptedToken = offerOnChain.acceptedTokens[i];
      const parsedToken = getOrCreateAcceptedToken(
        offerID,
        _acceptedToken.token,
        _acceptedToken.minimumAmountPerUnit,
      );
      offer.acceptedTokens.push(parsedToken.id.toString());
    }

    log.debug("Created offerID: {}", [_offerID]);
    offer.save();
  }

  return offer;
}

export function getOrCreateOfferByID(
  hypercertContract: Address,
  fractionID: BigInt,
  offerID: BigInt,
): Offer | null {
  const _fractionID = getID(fractionID, hypercertContract);
  const _offerID = _fractionID.concat("-".concat(offerID.toString()));
  const offer = Offer.load(_offerID);

  if (offer == null) {
    log.error("Offer with ID {} does not exist", [_offerID]);
  }

  return offer;
}
