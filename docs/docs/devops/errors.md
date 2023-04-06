# Errors

## Deploying

### Artifact for contract "HypercertMinter" not found

#### Error message

`Error HH700: Artifact for contract "HypercertMinter" not found.`

#### Cause

Attempting to deploy a contract with `npx hardhat deploy` before the contract has been compiled by hardhat. Contracts compiled by forge are currently not visible to hardhat (this could be a configuration problem).

### insufficient funds for intrinsic transaction cost

#### Error message

`Error: insufficient funds for intrinsic transaction cost`

#### Cause

The environment variable `MNEMONIC` is not configured correctly.

Alternatively, the wallet may not have enough funds for the selected network

Causing pause twice

Error: cannot estimate gas; transaction may fail or may require manual gas limit

reason: 'execution reverted: Pausable: paused',

#### Etherscan API

Note: It can take between 5-10 minutes before a newly created etherscan API key becomes valid for queries to goerli.

When using an etherscan API key that was too recently created, hardhat tasks using etherscan to verify transactions will exit with an error message:

`Etherscan returned with message: NOTOK, reason: Invalid API Key`

Despite this error the transaction may have succeeded, the hardhat task just can't confirm it.

It is unknown if this is a problem for queries to mainnet as well.

Metamask makes it very difficult to have multiple wallets.
