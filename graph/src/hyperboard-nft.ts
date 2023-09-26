import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  BaseUriUpdated as BaseUriUpdatedEvent,
  GotConsent as GotConsentEvent,
  HypercertMinterUpdated as HypercertMinterUpdatedEvent,
  Mint as MintEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  SubgraphUpdated as SubgraphUpdatedEvent,
  Transfer as TransferEvent,
  WithdrawErc20 as WithdrawErc20Event,
  WithdrawEther as WithdrawEtherEvent
} from "../generated/Hyperboard/Hyperboard"
import {
  Approval,
  ApprovalForAll,
  BaseUriUpdated,
  GotConsent,
  Hyperboard,
  Hypercert,
  HypercertMinterUpdated,
  Mint,
  OwnershipTransferred,
  SubgraphUpdated,
  Transfer,
  WithdrawErc20,
  WithdrawEther
} from "../generated/schema"


export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId
  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved
  entity.save()
}

export function handleBaseUriUpdated(event: BaseUriUpdatedEvent): void {
  let entity = new BaseUriUpdated(
    "1"
  )
  entity.baseUri = event.params.baseUri
  entity.save()
}

export function handleGotConsent(event: GotConsentEvent): void {
  let entity = new GotConsent(
    event.params.owner.toHexString() + "-" + event.params.claimId.toString()
  )
  entity.tokenId = event.params.tokenId
  entity.claimId = event.params.claimId
  entity.owner = event.params.owner
  entity.save()
  const params = event.params;
  const id = params.claimId.toString() + params.tokenId.toString();
  let hypercert = Hypercert.load(id);
  if (hypercert == null) {
    hypercert = new Hypercert(id);
  }
  hypercert.claimId = params.claimId;
  hypercert.tokenId = params.tokenId;
  hypercert.owner = params.owner;
  hypercert.save();

  const boardId = params.tokenId.toString()
  let board = Hyperboard.load(boardId)
  if (board != null) {
    let arr = board.hypercerts;
    if (arr == null) {
      arr = [hypercert.id]
    } else {
      arr.push(hypercert.id);
    }
    board.save();

  }

}

export function handleHypercertMinterUpdated(
  event: HypercertMinterUpdatedEvent
): void {
  let entity = new HypercertMinterUpdated(
    "1"
  )
  entity.hypercertMinter = event.params.hypercertMinter
  entity.save()
}

export function handleMint(event: MintEvent): void {

  let entity = new Mint(
    event.params.tokenId.toString()
  )
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId
  entity.metadata = event.params.metadata;
  entity.save()
  let id = event.params.tokenId.toString()
  let board = Hyperboard.load(id)
  if (board == null) {
    board = new Hyperboard(id)
  }
  let params = event.params;
  board.tokenId = params.tokenId;
  board.metdata = params.metadata;
  board.to = params.to;
  board.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    "1"
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}

export function handleSubgraphUpdated(event: SubgraphUpdatedEvent): void {
  let entity = new SubgraphUpdated(
    "1"
  )
  entity.endpoint = event.params.endpoint
  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId
  entity.save()
}

export function handleWithdrawErc20(event: WithdrawErc20Event): void {
  let entity = new WithdrawErc20(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.to = event.params.to
  entity.tokenAddress = event.params.tokenAddress
  entity.amount = event.params.amount
  entity.save()
}

export function handleWithdrawEther(event: WithdrawEtherEvent): void {
  let entity = new WithdrawEther(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.save()
}
