---
title: Frequently Asked Questions
id: FAQ
---

# FAQs

## General

### How is a hypercert different than a POAP or Impact NFT?

Hypercerts have some things in common with certain POAPs or Impact NFTs, but also a number of crucial differences.

First, all POAPs and most Impact NFTs are implemented as non-fungible tokens (ERC-721s). Hypercerts are currently being implemented as semi-fungible tokens (ERC-1155s), meaning it is possible to own more than one unit or fraction of a given hypercert. This makes it easy and intuitive to display the share of hypercerts that a given owner has.

Second, hypercerts have specific metadata requirements and interpretation logic. These include a standard schema for how the six required hypercert dimensions are defined and captured (i.e., work scopes, impact scopes, timeframes, contributors, etc) as well as logic for how to interpret different inputs (e.g., how to include or exclude certain work scopes, create an indefinite time period, etc). POAPs have a completely different schema. Although there is no standard schema for Impact NFTs, an Impact NFT project could choose to adopt the hypercert standard and token interface and thereby achieve compatibility.

Third, the hypercerts token interface is intended to support several functions that are not possible out of the box with other token standards, chiefly, atomic split and merge capabilities. We also expect other protocols to work with hypercerts for the purposes of prospective and retrospective funding, contributor verification, and impact evaluation.

In conclusion, the similarities between hypercerts and other types of tokens are mostly superficial. For certain use cases, POAPs or a custom flavor of Impact NFT may be better suited for projects.

### Are hypercerts the same as impact evaluations?

No. A hypercert is a claim over a discrete piece of work and the impact that may result from that work. It has no opinion about the legitimacy or quality of the claim. 

An impact evaluation is an opionated assessment about the legitimacy or quality of a claim.

For example, a hypercert might represent "Planting trees in the Amazon in 2022". An impact evaluation might point to that hypercert and assert the percent of trees that survived, the amount of CO2 removed by the trees, or the income change among people living around the project.

Over time, the expectation is that hypercerts that attract multiple, high quality, credibly neutral impact evaluations will be more valuable than ones that do not.

### What can I do with my hypercert?

The `rights` dimension specific what an owner can do with their hypercert. Currently, the only `right` that owners have is "Public Display". Over time, we hope the protocol can support various `rights` including transfers, intellectual property, tax-deductibility, carbon offsets, ESG reporting, and more.

### Where can I purchase a hypercert?

Currently, it is only possible to purchase a hypercert from a creator or project. This can be facilitated directly by the project or via a third-party marketplace like OpenSea. Currently, hypercerts cannot be resold on secondary markets.

### What chain(s) is hypercerts running on?

The hypercerts smart contracts have been deployed on Optimism and Goerli Testnet. We plan to support various EVM chains in the near future.

### How do I bridge to Optimism?

There are various bridging services including the official [Optimism Bridge](https://app.optimism.io/bridge/deposit). Note that bridging assets from Ethereum to Optimism will incur a gas fee.

### How do I get Goerli (testnet) ETH?

Alchemy has a popular [Goerli Faucet](https://goerlifaucet.com/) that provides 0.2 ETH per day to registered users. 

### How do I create a hypercert?

We've created a step-by-step guide in the documents, which you can find [here](./minting-guide/minting-guide-start.md). 

### How do I create a hypercert from a multisig?

If you are creating a hypercert on Optimism, then you will need an Optimism-based multisig. (Unfortunately, Safe wallets created on Ethereum won't work on Optimism.)

### How do I claim a hypercert? Can I claim all of the ones I’m eligible for at once?

After you connect your wallet, you will see a dashboard of hypercerts that you can claim. You can either claim them individually or in a batch transaction. Note that if you perform the batch transaction you will automatically claim _all_ hypercerts you are allow-listed for. (You still pay a gas fee for each claim, however.) If you don't want to claim _all_ at once, then you should claim them one-by-one.

### What token standard do Hypercerts utilize?

The interface supports both ERC-1155s and 721s. Our current implementation makes use of [ERC-1155](https://eips.ethereum.org/EIPS/eip-1155) (a semi-fungible token).

### What are the required fields to generate a hypercert?

There are six required dimensions:

1. Set of contributors: An ordered list of all contributors, who claim to do or have done the work described by this hypercert.
2. Scope of work: A conjunction of potentially-negated work scope tags, where an empty string means “all”:
3. Time of work: A date range, from the start to the end of the work being claimed by this hypercert.
4. Scope of impact: A conjunction of potentially-negated impact scope tags, where an empty string means “all”:
5. Time of impact: Date ranges from the start to the end of the impact.
6. Rights of the owners: An unordered list of usage rights tags, which define the rights of the owners of this hypercert over the work being claimed by this hypercert.

Hypercerts also need a name and description.

### How much gas will it cost to create or claim a hypercert?

In our simulations, the gas fee for minting a hypercert on Ethereum Mainnet ranged from 2,707,282 to 7,515,075 gwei (0.0027 to 0.0075 ETH). Minting costs are significantly cheaper on Optimism (i.e., below 0.0005 ETH or less than $1). Claiming a hypercert should be below 0.0001 ETH or less than $0.10 on Optimism.

### Have the smart contracts been audited?

Yes. The auditor's security report is available [here](https://github.com/pashov/audits/blob/master/solo/Hypercerts-security-review.md).

### How is the allowlist generated?

For Gitcoin projects, an allowlist is generated from a snapshot of all of the on-chain funding received by the project.

The queries used to generate the allowlists can be viewed here:

- ETH Infra: https://dune.com/queries/1934656
- Climate: https://dune.com/queries/1934689
- OSS: https://dune.com/queries/1934969

Once the snapshot is taken, the formula assigns one fraction (rounded down) for every $1 (using the exchange rate at the time of the transaction) that a donor contributed to the project. It also provides a small buffer (of 5%) so that a transaction worth $0.999 or $0.951 remains eligible for one fraction.

For example:

- $5.60 donated --> 5 fractions
- $5.20 donated --> 5 fractions
- $0.96 donated --> 1 fraction
- $0.52 donated --> 0 fractions

### Why am I not on the allowlist even though I contributed to the project?

If you contributed less than $1 DAI to a project, then you will not be eligible to claim a hypercert fraction.

### How do I burn or retire a hypercert?

We don't yet have a frontend for burning hypercerts but you can do this by interacting directly with the smart contract on Etherscan. 



