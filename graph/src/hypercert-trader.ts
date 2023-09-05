import {
  OfferCancelled as OfferCancelledEvent,
  OfferCreated as OfferCreatedEvent,
  Trade as TradeEvent,
} from "../generated/HypercertTrader/HypercertTrader";
import { Trade } from "../generated/schema";
import { getOrCreateOffer, getOrCreateOfferByID } from "./utils";
import { log } from "@graphprotocol/graph-ts";

export function handleOfferCancelled(event: OfferCancelledEvent): void {
  const offer = getOrCreateOfferByID(
    event.params.hypercertContract,
    event.params.fractionID,
    event.params.offerID,
  );

  if (!offer) {
    return;
  }

  offer.status = "Cancelled";

  offer.save();
}

export function handleOfferCreated(event: OfferCreatedEvent): void {
  const offer = getOrCreateOffer(
    event.params.hypercertContract,
    event.address,
    event.params.fractionID,
    event.params.offerID,
  );

  // TODO get accepted tokens
  offer.save();
}

export function handleTrade(event: TradeEvent): void {
  const offer = getOrCreateOfferByID(
    event.params.hypercertContract,
    event.params.fractionID,
    event.params.offerID,
  );

  if (!offer) {
    log.error("Offer with ID {} not found", [
      event.params.offerID.toHexString(),
    ]);
    return;
  }

  const tradeID = offer.id.concat(event.transaction.hash.toHexString());

  let trade = Trade.load(tradeID);

  if (trade == null) {
    trade = new Trade(tradeID);

    trade.buyer = event.params.buyer;
    trade.offerID = offer.id;
    trade.unitsSold = event.params.unitsBought;
    trade.token = event.params.buyToken.toHexString();
    trade.amountPerUnit = event.params.tokenAmountPerUnit;

    trade.offerID = offer.id;
  }

  trade.save();
}
