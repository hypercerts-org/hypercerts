# InheritedStrategy

*LooksRare protocol team (👀,💎)*

> InheritedStrategy

This contract handles the verification of parameters for standard transactions.         It does not verify the taker struct&#39;s itemIds and amounts array as well as         minPrice (taker ask) / maxPrice (taker bid) because before the taker executes the         transaction and the maker itemIds/amounts/price should have already been confirmed off-chain.

*A standard transaction (bid or ask) is mapped to strategyId = 0.*



