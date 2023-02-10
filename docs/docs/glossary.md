---
title: Glossary
id: glossary
sidebar_position: 19
---

# Glossary for Hypercerts

<dl>
  <dt><strong>Contributor</strong></dt>
  <dd>An individual or group of individuals who performs the work described in a hypercert.</dd>
  <dt><strong>Evaluator</strong></dt>
  <dd>An individual, group of individuals, or algorithm that evaluates the impact of work. There are two types: Scouts evaluate the potential impact before it is done, auditors evaluate the impact after it is done.</dd>
  <dt><strong>Scout</strong></dt>
  <dd>An individual, group of individuals, or algorithm that evaluates the potential impact of work before it is done.</dd>
  <dt><strong>Auditor</strong></dt>
  <dd>An individual, group of individuals, or algorithm that evaluates the impact of work after it is done.</dd>
  <dt><strong>Impact Funding System (IFS)</strong></dt>
  <dd>A system of actors (contributors, evaluators, funders) that interact according to a set of rules (funding mechanisms, coordination mechanisms) to maximize the domain-specific impact.
  </dd>
  <dt><strong>Fraction</strong></dt>
  <dd>A token that represents a quantified proportion of a hypercert.</dd>
  <dt><strong>Hypercert</strong></dt>
  <dd>A token that (1) accounts for work that is supposed to be impactful, (2) represents the – potentially explicitly specified – impact of this work, and (3) assigns right over this work to its owners. If a hypercert is split into multiple fractions, the hypercert refers to the sum of all of its fractions. Hypercert also refers to the *hypercert standard* that defines the token and data standard for hypercerts.</dd>
  <dt><strong>Hypercert standard</strong></dt>
  <dd></dd>
  <dt><strong>Funder</strong></dt>
  <dd></dd>
  <dt><strong>Minting a hypercert</strong></dt>
  <dd></dd>
  <dt><strong>Claiming a hypercert</strong></dt>
  <dd></dd>
  <dt><strong>Creating a hypercert</strong></dt>
  <dd></dd>
  <dt><strong>Token</strong></dt>
  <dd></dd>
  <dt><strong>Retrospective funder</strong></dt>
  <dd></dd>
  <dt><strong>Prospective funder</strong></dt>
  <dd></dd>
  <dt><strong>Project</strong></dt>
  <dd></dd>
  <dt><strong>Impact evaluation</strong></dt>
  <dd></dd>
  <dt><strong>Allowlist</strong></dt>
  <dd></dd>
  <dt><strong>Dimensions of the impact space</strong></dt>
  <dd></dd>
  <dt><strong>Impact space</strong></dt>
  <dd></dd>
  <dt><strong>Impact scope</strong></dt>
  <dd></dd>
  <dt><strong>Work scope</strong></dt>
  <dd></dd>
  <dt><strong>Time of impact</strong></dt>
  <dd></dd>
  <dt><strong>Time of work</strong></dt>
  <dd></dd>
  <dt><strong>Rights</strong></dt>
  <dd></dd>
  <dt><strong>Set of contributors</strong></dt>
  <dd></dd>
  <dt><strong>Impact</strong></dt>
  <dd></dd>
  <dt><strong>Work</strong></dt>
  <dd></dd>
  <dt><strong></strong></dt>
  <dd></dd>
</dl>


| Term | Description | Instead of | Protocol Entity* |
| -------- | -------- | -------- | -------- |
| Contributor     | The parties contributing to a unit of impact claimed by a *hypercert*.      | ~~impact creator~~, ~~author~~    | ☑️ |
| Evaluator     | A party that assesses whether a given hypercert represents a legimate claim to the underlying work and impact. Evaluators typically look at the *Project* or talks with *Contributors*. |  | - |
| Fraction     | Represents a tradeable part of a *hypercert*. Can be split further, Fractions of the same hypercert can be merged into a larger fraction. Fractions are implemented as [semi-fungible (EIP-3525)](https://eips.ethereum.org/EIPS/eip-3525) → *tokens*. | ~~Token~~ | ☑️ |
| Funder     | Any party buying *fractions* of a *hypercert* or promising to do so (*retrospective funder*).      | ~~Donor~~ | - |
| Funder, retrospective     | Any party promising to buy *fractions* of a *hypercert*.      | ~~retroactive funder~~ | - |
| Hypercert     | A claim in the impact space, i.e. a unique statement about work on a public good, its *contributors*, and its *impact*, constrainted in time. Hypercerts consist of 1...n *fractions*. br /> <br/>Under the hood, a *hypercert* corresponds to a *slot* as defined in [EIP-3525](https://eips.ethereum.org/EIPS/eip-3525).      | ~~impact cert~~, ~~impact claim~~, ~~slot~~, ~~HyperCert~~    | ☑️ |
| Impact     | Not defined by the protocol but negotiated between *minters* and *funders*.      | | - |
| Minter     | The party minting a *hypercert*. Typically part of the same project as the *hypercert's* *Contributors*.      | ~~impact creator~~ | ☑️ |
 Project     | Typically, *Contributors* collaboratively create impact and claim hypercerts by working together on one or more *Projects*. | ~~Team~~ | - |
| Slot     | Important implementation detail. Hypercerts are represented by slots as defined in [EIP-3525](https://eips.ethereum.org/EIPS/eip-3525). All *fractions* (tokens) assigned to the same slot form a *hypercert*.       |  | ☑️ |
| Token     | Important Implementation detail. Tokens represent *fraction* and are the tradeable unit of a *hypercert*. |  | ☑️ |


*) Some terms represent entitites that exist on the hypercert protocol lebel. Others are part of our glossary only to make documentation and conversation easier.
