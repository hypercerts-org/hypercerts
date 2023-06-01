# Fungibility

## Value

### Split / merge token values

```js
const { tokenIds } = await hypercerts.splitFraction({
  tokenId,
  units: [10, 12, 15],
});
const { tokenId } = await hypercerts.mergeFractions({ tokenIds });
```

### Split / merge claim data

```js
const { claimIds } = await hypercerts.splitClaim({
  claimId,
  TODO: somehow specify hypercert subregions
});
const { claimId} = await hypercerts.mergeClaims({
  claimIds,
});
```

## Impact
