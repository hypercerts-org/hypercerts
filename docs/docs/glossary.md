---
title: Glossary
id: glossary
sidebar_position: 10
---

# Glossary for Hypercerts

> 📖 **Purpose of this glossary**
> 
> Consistent terms and wording make learning faster. The systemic benefits of hypercerts depend on its indepentend adoption by projects across the globe. A clear vocabulary makes it easier to exchange thoughts and collaboratively improve hypercerts and the world around us.

| Term | Description | Instead of | Protocol Entity* |
| -------- | -------- | -------- | -------- |
| Contributor     | The parties contributing to a unit of impact claimed by a *hypercert*.      | ~~impact creator~~, ~~author~~    | ☑️ |
| Evaluator     | A party that assesses whether a given hypercert represents a legimate claim to the underlying work and impact. Evaluators typically look at the *Project* or talks with *Contributors*. |  | - |
| Fraction     | Represents a tradeable part of a *hypercert*. Can be split further, Fractions of the same hypercert can be merged into a larger fraction. Fractions are implemented as [semi-fungible (EIP-3525)](https://eips.ethereum.org/EIPS/eip-3525) → *tokens*. | ~~Token~~ | ☑️ |
| Funder     | Any party buying *fractions* of a *hypercert* or promising to do so (*retrospective funder*).      | ~~Donor~~ | - |
| Funder, retrospective     | Any party promising to buy *fractions* of a *hypercert*.      | ~~retroactive funder~~ | - |
| Hypercert     | A claim in the impact space, i.e. a unique statement about work on a public good, its *contributors*, and its *impact*, constrainted in time. Hypercerts consist of 1...n *fractions*. See also [the hypercert Ledger](background/ledger) br /> <br/>Under the hood, a *hypercert* corresponds to a *slot* as defined in [EIP-3525](https://eips.ethereum.org/EIPS/eip-3525).      | ~~impact cert~~, ~~impact claim~~, ~~slot~~, ~~HyperCert~~    | ☑️ |
| Impact     | Not defined by the protocol but negotiated between *minters* and *funders*.      | | - |
| Minter     | The party minting a *hypercert*. Typically part of the same project as the *hypercert's* *Contributors*.      | ~~impact creator~~ | ☑️ |
 Project     | Typically, *Contributors* collaboratively create impact and claim hypercerts by working together on one or more *Projects*. | ~~Team~~ | - |
| Slot     | Important implementation detail. Hypercerts are represented by slots as defined in [EIP-3525](https://eips.ethereum.org/EIPS/eip-3525). All *fractions* (tokens) assigned to the same slot form a *hypercert*.       |  | ☑️ |
| Token     | Important Implementation detail. Tokens represent *fraction* and are the tradeable unit of a *hypercert*. |  | ☑️ |


*) Some terms represent entitites that exist on the hypercert protocol lebel. Others are part of our glossary only to make documentation and conversation easier.