## Findings

| Severity Level  | Finding ID | Description                                                                                                                      | Status |
| --------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- | ------ |
| High            | TRST-H-1   | A buyer can purchase more token units than the seller intended                                                                   | in V02 |
| High            | TRST-H-2   | The fraction offer maker order is not invalidated correctly, leading to orders being replayed                                    | Fixed  |
| High            | TRST-H-3   | When Hypercerts are traded in Collection or Dutch auction offers, one of the sides can provide a lower unit amount than expected | in V02 |
| Medium          | TRST-M-1   | An attacker could grief buyer into getting a lower-value item than intended                                                      | Fixed  |
| Medium          | TRST-M-2   | Fraction offers can be blocked from being fully fulfilled                                                                        | inV02  |
| Low             | TRST-L-1   | The strategy validation function for fraction sales could revert                                                                 | Fixed  |
| Low             | TRST-L-2   | Hypercert orders with invalid amount will pass validations                                                                       | Fixed  |
| Recommendations | TRST-R-1   | Improve validation of orders in fraction offers                                                                                  | Done   |
| Systemic Risk   | TRST-SR-1  | Risks associated with hypercerts                                                                                                 | OK     |
|                 | TRST-OOS   | Allowlist tracking                                                                                                               | Fixed  |

### TRST-H-1 | A buyer can purchase more token units than the seller

The original design of the strategy is that the maker, i.e. seller, would split a fraction of the hypercert into a new
fraction. The buyer would then purchase units of the new fraction untill it holds 0 units. If a sale would by a portion
of the available units a split would be initiated and the new fraction would be transfered to the buyer. If a sale would
clear out the fraction (units would become 0), the strategy would then transfer the hypercert fraction to the buyer.

This implies the intention of the seller is to sell all available units. Admittedly, this can be confusing for users and
indeed introduces risk to the seller.

To resolve the issue we changed the design of the strategy. Since a hypercert fraction in an NFT, the `amounts` field in
the `MakerAsk` struct is required to be an array of size 1 with value 1. The `additionalParameters` field was expanded
with `minUnitsToKeep` to declare the amount of units that should remain in the hypercert fraction. This has been tested
in `StrategyHypercertFractionOffer.sol`.

### TRST-H-2 | The fraction offer maker order is not invalidated correctly, leading to orders being replayed

We've updated the logic to invalidate the order to test agains the change in balance when the strategu would execute:

```solidity
isNonceInvalidated = (IHypercertToken(makerAsk.collection).unitsOf(itemIds[0]) - unitAmount) == minUnitsToKeep;
```

This has been tested in `StrategyHypercertFractionOffer.sol` under `testMakerAskInvalidation` where we execute multiple
sales to invalidated the order, add additional units to the original hypercert fraction and execute a sale to validate
that the order still cannnot be executed because the nonce of the order has been invalidated.

Additionally, to underline the paradigm of 'fractions are NFTs` we've updated the OrderValidatorV2A to not check on the
units held by the fraction, but whether the fraction is owned by the maker. Check on the units held by the fraction is
still done in the strategy.

### TRST-H-3 | When Hypercerts are traded in Collection or Dutch auction offers, one of the sides can provide a lower unit amount than expected

Following the recommendation, we've split the `CollectionOffer` and `DutchAuctionOffer` strategies into two separate
strategies for ERC721/ERC1155 and hypercerts. The hypercert specific strategies can be found under
`StrategyHypercertCollectionOffer.sol` and `StrategyHypercertDutchAuctionOffer.sol` and tests have been added to the
foundry folder. To ensure the correct strategy is used checks on `CollectionType` have been added to both the order
validators and executors in the strategies.

To add checks on the units held by the fraction the units held by a fraction are stored in the order at create time, in
some cases will be provided by the taker at execution time, with additional calls to the `HypercertMinter` contract to
validate the units held by the fraction.

### TRST-M-1 | An attacker could grief buyer into getting a lower-value item than intended

Following the recommendation, we've added signed messages to the `StrategyHypercertFractionOffer.sol` strategy. This
entailed adding signed message parsing and updating the corresponding tests cases as well.

To prevent replay attacks, the signed message consists of the following fields:

```solidity
    bytes32 orderHash,
    uint256 offeredItemId,
    bytes32[] memory proof
```

The signature is used to extract the signer, compare that account to the recipient declared in the Taker Bid.
Effectively, the signature can only be used to execute the order for the intended recipient on the provided Maker Ask.

### TRST-M-2 | Fraction offers can be blocked from being fully fulfilled

The `StrategyHypercertFractionOffer.sol` strategy has been updated to allow the maker to set whether they want to sell
the leftover units.

We find that it's expected behaviour that you can be left over with a bit of the fraction, but can understand that this
can be confusing for users. The parameter `sellLeftover` has been added to the `additionalParameters` field of the
`MakerAsk` struct. If set to `true` the strategy will sell the leftover units to the taker.

### TRST-L-1 | The strategy validation function for fraction sales could revert

Fixed.

### TRST-L-2 | Hypercert orders with invalid amount will pass validations

Added additional logic check in assembly to `_validateAmountNoRevert` and implemented the method in the hypercert
strategies.

### TRST-R-1 | Improve validation of orders in fraction offers

Added additional checks on the length of the additional parameters for all hypercert strategies.

### TRST-SR-1 | Risks associated with hypercerts

Acknowledged.

### TRST-OOS | Allowlist tracking

Credits to Trust for quickly reporting an issue on the allowlist tracking. While we checked on allowlist limits, the
counter for minted units per claim was not updated. This has been fixed in `AllowlistMinter.sol`.
