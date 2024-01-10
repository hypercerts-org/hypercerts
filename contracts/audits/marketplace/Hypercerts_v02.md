## Findings

| Severity Level | Finding ID | Description                                                                                                                      | Status       |
| -------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| High           | TRST-H-1   | A buyer can purchase more token units than the seller intended                                                                   | Acknowledged |
| High           | TRST-H-3   | When Hypercerts are traded in Collection or Dutch auction offers, one of the sides can provide a lower unit amount than expected | Review       |
| Medium         | TRST-M-2   | Fraction offers can be blocked from being fully fulfilled                                                                        | Review       |
| ???            | TRST-OOS   | Gas optimisation `_beforeUnitTransfer`                                                                                           | Fixed        |

### TRST-H-1 A buyer can purchase more token units than the seller intended

We acknowledge that the user can increase the amounts of units during the sale periode, potentially leading to a sale of
more units than the seller intended. This is a risk that is inherent to the design of the strategy. However, this would
require the user to actively increase the amount of units during the sale period, which is not a common use case.

### TRST-H-3 When Hypercerts are traded in Collection or Dutch auction offers, one of the sides can provide a lower unit amount than expected

#### H.3.A

> This would end up transferring ownership of the Hypercert, but it never checks that the unitsPerItem declared in the
> maker bid is actually transferred. A malicious user can transfer all but one unit out of the tokenID to complete the
> exploit.

Validations have been added to the order execution steps to ensure that the amount of units transferred is equal to the
amount of units declared in the order.

First we get the total of the units to be transfered based on the `itemIds` returned by the strategy:

```solidity
      uint256 unitsHeldByItems;
        if (makerBid.collectionType == CollectionType.Hypercert) {
            unitsHeldByItems += _getUnitsHeldByHypercertFractions(makerBid.collection, itemIds);
        }
```

After the transfer of funds, we validate the amount of units still held by the provided `itemIds`:

```solidity
    if (makerBid.collectionType == CollectionType.Hypercert) {
            // If not a fractional sale
            if (
                strategyInfo[makerBid.strategyId].selector
                    != StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBid.selector
                    && strategyInfo[makerBid.strategyId].selector
                        != StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBidWithAllowlist.selector
            ) {
                if (_getUnitsHeldByHypercertFractions(makerBid.collection, itemIds) != unitsHeldByItems) {
                    revert UnitAmountInvalid();
                }
            }
        }
```

Lastly, the fraction is transfered to the buyer.

#### H.3.B

> Note that Hypercerts units can be donated to other tokenIDs inside the same base type. This means that any logic that
> assumes an order maker’s token amount is controlled by them is fragile.

A bug in the protocol has been identified with this finding. During the execution of
`_mergeTokensUnits(address _account, uint256[] memory _fractionIDs)` ownership of the units held by the `_account` is
validation, with an additional check on allowances for `msg.sender` as an operator. This check is not executed on the
receiving fraction. As an effect, an owner of hypercert units can send units to a fraction not held by the same owner.

We added the following check to the `_mergeTokensUnits` function (and test cases):

```solidity
if (_account == address(0) || owners[_fractionID] != _account || owners[target] != _account)
    {
        revert Errors.NotAllowed();
    }
```

### TRST-M-2 Fraction offers can be blocked from being fully fulfilled

> Note that if sellLeftover is true, there is no check for unitAmount < minUnitAmount. However this check should still
> be applied in all but the last sale. In the current implementation, the minUnitAmount becomes devoid of meaning

The checks have been updated to explicity handle the `sellLeftover` case. For readibility, the checks have been split
and made more verbose, where the check
`(IHypercertToken(makerAsk.collection).unitsOf(itemIds[0]) - unitAmount) < minUnitsToKeep` is duplicated.

```solidity
    // Check on prices
    if (pricePerUnit < makerAsk.price || makerAsk.price == 0) {
        revert OrderInvalid();
    }

    // Check on unitAmount except for selling leftover units
    if (minUnitAmount > maxUnitAmount || unitAmount == 0 || unitAmount > maxUnitAmount) {
        revert OrderInvalid();
    }

    // Handle the case where the user wants to sell the leftover units (to prevent dusting)
    if (sellLeftover) {
        // If the unitAmount is lower than the specified minUnitAmount to sell
        if (unitAmount < minUnitAmount) {
            // We expect to sale to be executed only if the units held are equal to the minUnitsToKeep
            if (IHypercertToken(makerAsk.collection).unitsOf(itemIds[0]) - unitAmount != minUnitsToKeep) {
                revert OrderInvalid();
            }
        } else {
            // Don't allow the sale to let the units held get below the minUnitsToKeep
            if ((IHypercertToken(makerAsk.collection).unitsOf(itemIds[0]) - unitAmount) < minUnitsToKeep) {
                revert OrderInvalid();
            }
        }
    } else {
        // If selling the leftover is not allowed, the unitAmount must not be smaller than the minUnitAmount
        if (unitAmount < minUnitAmount) {
            revert OrderInvalid();
        }

        // Don't allow the sale to let the units held get below the minUnitsToKeep
        if ((IHypercertToken(makerAsk.collection).unitsOf(itemIds[0]) - unitAmount) < minUnitsToKeep) {
            revert OrderInvalid();
        }
    }
```

### TRST-OOS Gas optimisation `_beforeUnitTransfer`

The followin check was executed in the loop for all items in a batch:

```solidity
if (from != _msgSender() && !isApprovedForAll(from, _msgSender())) revert Errors.NotApprovedOrOwner();
```

Since the answer to this check is the same for all items in the batch, we moved the check outside of the loop. Credit to
Trust for reporting this optimisation.

```

```
