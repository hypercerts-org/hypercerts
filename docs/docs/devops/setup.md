### Setup

#### Gather tools

Install NodeJS and git

Clone the repository: 
`$ git clone git@github.com:Network-Goods/hypercerts-protocol.git`

`$ cd hypercerts-protocol`

Install dependancies:
`$ yarn`


#### Configure Enviroment

In the root directory of the `hypercerts-protocol` repository, create a copy of `.env.example` and rename the copy to `.env`.

The (enviroment variable, value) pairs in the `.env` file should take the form of:
```
ENVIROMENT_VARIABLE_NAME="value"
```

The values for the environment variables are stored in the `Hypercerts Dev` 1Password vault. Edit the newly created `.env` file to configure the environment variables require for running hardhat tasks accoring to the following:

**Infura API**
Variable Name: `INFURA_API_KEY`
Variable Value: The value of the `credential` field on the 'Infura API' item in the 1Password vault

**Etherscan API**
Variable Name: `ETHERSCAN_API_KEY`
Variable Value: The value of the `credential` field on the 'Etherscan API' item in the 1Password vault

**Wallet**
Variable Name: `NMEMONIC`
Variable Value: The value of the `credential` field on the 'Goerli Wallet Mnemonic' item in the 1Password vault


#### Compile the contract

`$ npx hardhat compile`
