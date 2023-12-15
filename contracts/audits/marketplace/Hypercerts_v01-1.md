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
