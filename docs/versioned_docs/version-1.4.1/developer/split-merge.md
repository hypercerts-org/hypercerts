# Split and Merge

> :construction: **NOTE**: This is a work-in-progress and may not be fully functioning yet.

## By Token Value

### Split / merge token values

```js
const { tokenIds } = await hypercerts.splitFractionUnits({
  fractionId,
  units: [10n, 12n, 15n],
});
const { tokenId } = await hypercerts.mergeFractionUnits({ fractionIds });
```
