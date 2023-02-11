# API Documentation

`mintHypercertToken(HypercertMetadata claimData, BigNumberish totalUnits)`

- Validates the `claimData`
- Stores metadata on IPFS
- Uses CID to mint hypercert token with `totalUnits`

`mint(HypercertMetadata claimData, BigNumberish[] units)`

- Validates the `claimData`
- Stores metadata on IPFS
- Uses CID to mint hypercert token with fractions equal to `units`

`splitValue(string account, string tokenID, BigNumberish[] units)`

- Splits token with `tokenID` into fractions equal to `units`
- Updated metadata?

`mergeValue(string[] tokenIDs)`

- Merges tokens in `tokenIDs`.
- Burns tokens left without value

`burn(string tokenID)`

- Updates metadata in IPFS to represent burned state
- Store updated metadata in token at `tokenID`
- Burn token at `tokenID`
