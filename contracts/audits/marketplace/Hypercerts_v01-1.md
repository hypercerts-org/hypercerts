## Findings

| Severity Level  | Finding ID | Description                                                                                                                      | Status |
| --------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- | ------ |
| High            | TRST-H-1   | A buyer can purchase more token units than the seller intended                                                                   |        |
| High            | TRST-H-2   | The fraction offer maker order is not invalidated correctly, leading to orders being replayed                                    |        |
| High            | TRST-H-3   | When Hypercerts are traded in Collection or Dutch auction offers, one of the sides can provide a lower unit amount than expected |        |
| Medium          | TRST-M-1   | An attacker could grief buyer into getting a lower-value item than intended                                                      |        |
| Medium          | TRST-M-2   | Fraction offers can be blocked from being fully fulfilled                                                                        |        |
| Low             | TRST-L-1   | The strategy validation function for fraction sales could revert                                                                 |        |
| Low             | TRST-L-2   | Hypercert orders with invalid amount will pass validations                                                                       |        |
| Recommendations | TRST-R-1   | Improve validation of orders in fraction offers                                                                                  |        |

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
