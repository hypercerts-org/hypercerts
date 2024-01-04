### TRST-H-1 A buyer can purchase more token units than the seller intended

We acknowledge that the user can increase the amounts of units during the sale periode, potentially leading to a sale of
more units than the seller intended. This is a risk that is inherent to the design of the strategy. However, this would
require the user to actively increase the amount of units during the sale periode, which is not a common use case.

### TRST-H-3 When Hypercerts are traded in Collection or Dutch auction offers, one of the sides can provide a lower unit amount than expected

> This would end up transferring ownership of the Hypercert, but it never checks that the unitsPerItem declared in the
> maker bid is actually transferred. A malicious user can transfer all but one unit out of the tokenID to complete the
> exploit.

> Note that Hypercerts units can be donated to other tokenIDs inside the same base type. This means that any logic that
> assumes an order maker’s token amount is controlled by them is fragile.

The hypercerts protocol does not allow for transfering of units, or merging of fractions, between fractions not held by
the owner or without approval provided by the owner (i.e. `isApprovedForAll`). As such, the attacker would be either an
entity with allowance over the fractions held by the owner, or the owner itself.

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
