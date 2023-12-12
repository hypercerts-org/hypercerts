# Burning

> :construction: **NOTE**: This is a work-in-progress and may not be fully functioning yet.

## Burning fraction tokens

You can only burn fraction tokens that you own. Hypercert claims cannot be burned once minted.
You can get a list of all fraction tokens you own with [this query](./querying.md#claimtokensbyowner).

```js
const txHash = await hypercerts.burnClaimFraction({ claimId });
```
