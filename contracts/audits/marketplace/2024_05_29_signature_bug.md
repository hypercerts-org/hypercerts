## Issue

When a user has set the approvals on the marketplace, an attacker could submit a transaction signed by the attacker for
the (partial) sale of a hypercert fraction. The attacker would receive the funds, the order taker would receive the
fraction and the fraction owner would lose -a part of- the fraction.

## Fix

To mitigate this, we added a check on the split method. Specifically, a check on ownership of or approval on the
fraction by the signer of the message by calling the HyperMinter contract at time of order execution.

```solidity
if (
    from != IHypercert1155Token(collection).ownerOf(itemIds[0])
        && !IHypercert1155Token(collection).isApprovedForAll(
            IHypercert1155Token(collection).ownerOf(itemIds[0]), from)
    ) {
        revert OrderInvalid();
    }
```

The vulnerability is specific to the split function call because there is no check on the `operator` or `msg.sender`
relations/approval as common in the `transferFrom` methods. This is an artifact from changing the original design where
only the owner or somebody allowed by the owner would be able to split. The marketplace widens the attack vector because
anybody can operate the marketplace, compared to a trusted operator you specifically set the approval for.

To validate the changes, tests have been added to the TransferManager and one on the protocol level for 721 as a sanity
check.

## Additional information

### `libraries/IHypercert1155Token.sol`

- Because the check required calls to the HyperMinter not specified in the protocol interface, since the
  `approvalForAll` call is part of the 1155 spec, we've added an interface file to the marketplace contract directory.
- As we have the custom inferface file in the marketplace, imports from the `procotol` directory have been replaced with
  the custom interface file.

### Remove unused imports

- Removed unused imports from the `IHypercertToken.sol` file

### Replaced `_assertMerkleTreeAssumptions`

- Unrelated tests on `BatchMakerOrders` failed with the following error:
  `[FAIL. Reason: The `vm.assume` cheatcode rejected too many inputs (65536 allowed)]`
- Replace the assumption with bounded variables:

```solidity
    numberOrders = bound(numberOrders, 1, 2 ** MAX_CALLDATA_PROOF_LENGTH);
    orderIndex = bound(orderIndex, 0, numberOrders - 1);
```
