import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  BaseUriUpdated,
  GotConsent,
  HypercertMinterUpdated,
  Mint,
  OwnershipTransferred,
  SubgraphUpdated,
  Transfer,
  WithdrawErc20,
  WithdrawEther
} from "../generated/Contract/Contract"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createBaseUriUpdatedEvent(baseUri: string): BaseUriUpdated {
  let baseUriUpdatedEvent = changetype<BaseUriUpdated>(newMockEvent())

  baseUriUpdatedEvent.parameters = new Array()

  baseUriUpdatedEvent.parameters.push(
    new ethereum.EventParam("baseUri", ethereum.Value.fromString(baseUri))
  )

  return baseUriUpdatedEvent
}

export function createGotConsentEvent(
  tokenId: BigInt,
  claimId: BigInt,
  owner: Address
): GotConsent {
  let gotConsentEvent = changetype<GotConsent>(newMockEvent())

  gotConsentEvent.parameters = new Array()

  gotConsentEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  gotConsentEvent.parameters.push(
    new ethereum.EventParam(
      "claimId",
      ethereum.Value.fromUnsignedBigInt(claimId)
    )
  )
  gotConsentEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return gotConsentEvent
}

export function createHypercertMinterUpdatedEvent(
  hypercertMinter: Address
): HypercertMinterUpdated {
  let hypercertMinterUpdatedEvent = changetype<HypercertMinterUpdated>(
    newMockEvent()
  )

  hypercertMinterUpdatedEvent.parameters = new Array()

  hypercertMinterUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "hypercertMinter",
      ethereum.Value.fromAddress(hypercertMinter)
    )
  )

  return hypercertMinterUpdatedEvent
}

export function createMintEvent(
  to: Address,
  walletAddress: Address,
  tokenId: BigInt
): Mint {
  let mintEvent = changetype<Mint>(newMockEvent())

  mintEvent.parameters = new Array()

  mintEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  mintEvent.parameters.push(
    new ethereum.EventParam(
      "walletAddress",
      ethereum.Value.fromAddress(walletAddress)
    )
  )
  mintEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return mintEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createSubgraphUpdatedEvent(endpoint: string): SubgraphUpdated {
  let subgraphUpdatedEvent = changetype<SubgraphUpdated>(newMockEvent())

  subgraphUpdatedEvent.parameters = new Array()

  subgraphUpdatedEvent.parameters.push(
    new ethereum.EventParam("endpoint", ethereum.Value.fromString(endpoint))
  )

  return subgraphUpdatedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createWithdrawErc20Event(
  to: Address,
  tokenAddress: Address,
  amount: BigInt
): WithdrawErc20 {
  let withdrawErc20Event = changetype<WithdrawErc20>(newMockEvent())

  withdrawErc20Event.parameters = new Array()

  withdrawErc20Event.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  withdrawErc20Event.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  withdrawErc20Event.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawErc20Event
}

export function createWithdrawEtherEvent(
  to: Address,
  amount: BigInt
): WithdrawEther {
  let withdrawEtherEvent = changetype<WithdrawEther>(newMockEvent())

  withdrawEtherEvent.parameters = new Array()

  withdrawEtherEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  withdrawEtherEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawEtherEvent
}
