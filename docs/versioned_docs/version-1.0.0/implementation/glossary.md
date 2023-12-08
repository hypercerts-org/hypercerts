---
title: Glossary
id: glossary
sidebar_position: 3
---

# Glossary of Hypercerts Terms

## Main Terms

### Allowlist

A list that determines how fractions of hypercerts will be allocated to new owners. The current implementation requires a project to specify an allowlist at the time of minting its hypercert. Based on allowlists, designated new owners are able to claim their fractions.

### Claiming a fraction

Transferring the ownership of a fraction of a hypercert to a (new) owner. Generally 'claiming' implies minting a new token that represents said fraction by the new owner.

### Contributor

An individual or organization that performs some or all of the work described in a hypercert.

### Creating a hypercert

Synonymous to minting a hypercert.

### Fraction

A token that represents a quantified proportion of a hypercert denominated in units.

### Funder

Individual, organization, or algorithm that funds work. There are generally two types: (1) **prospective** funders, who fund work _before_ it is done, and (2) **retrospective** funders, who fund work _after_ it is done.

### Hypercert

A token that (1) accounts for work by specified contributors that is supposed to be impactful, (2) represents the – potentially explicitly specified – impact of this work, and (3) assigns right over this work to its owners. If a hypercert is split into multiple fractions, the hypercert refers to the sum of all of its fractions. The term `hypercert` may also refer to an implementation of the hypercert interface and standard.

### Hypercerts interface

The hypercerts [contract interface](https://github.com/hypercerts-org/hypercerts/blob/main/contracts/src/protocol/interfaces/IHypercertToken.sol), which declares the required functionality for a hypercert token. The current interface includes functions for minting, burning, splitting, and merging of hypercert tokens.

### Hypercerts implementation

An implementation that builds on top of the hypercerts interface and conforms to the hypercerts standard. For instance, our initial implementation uses an [ERC-1155](https://eips.ethereum.org/EIPS/eip-1155) token. The first 128 bits of the 256-bit token ID identifies the hypercert, the latter 128 bits identifies the specific fraction. Other implementations are possible (e.g., based on ERC-721) as long as they also conform to the data standard and use the hypercerts interface to support capabilities like splitting and merging of values.

### Hypercerts standard

A data standard for hypercerts. It requires the following fields to be defined in the metadata of the token: (1) set of contributors, (2) scope of work, (3) time of work, (4) scope of impact, (5) time of impact, (6) rights.

### Impact

Value that is created or destroyed by work. It mostly refers to positive impact, i.e., value that is created. If work destroys value, it is referred to as negative impact.

### Impact evaluation

A claim that a specified impact has or will occur – potentially claiming which work was responsible for the impact.

### Impact Funding System (IFS)

A system of actors (contributors, evaluators, funders) that interact according to a set of rules (funding mechanisms, coordination mechanisms) to maximize the domain-specific impact.

### Impact space

A geometrical space representing all possible work with its associated impact and rights. The space is spanned by the six fields specified in the hypercerts data standard: (1) set of contributors, (2) scope of work, (3) time of work, (4) scope of impact, (5) time of impact, (6) rights.

### Merging hypercerts

An operation to combine two or more hypercerts, such that the resulting, merged hypercert covers the exact same region in the impact space that the individual hypercerts covered.

### Minting a hypercert

Creating a new record for a hypercert on a blockchain. The properties of the hypercert (e.g., its timeframe and scope of work) are retrievable via this record.

### Project

Work by one or more contributors to achieve a goal. A project does not always need to be represented by one hypercert; it can be represented by multiple hypercerts (e.g., one hypercert per phase or milestone of a project). A hypercert can also represent multiple projects or even parts of multiple projects.

### Prospective funder

Individual, organization, or algorithm that fund work before it is done.

### Retrospective funder

Individual, organization, or algorithm that fund work after it is done.

### Rights

An unordered list of usage rights tags, which define the rights of the owners of a hypercert over the work being claimed by a hypercert. One of the axis of the impact space and part of the required fields in the hypercerts data standard.

### Set of contributors

An ordered list of all contributors, who claim to do or have done the work described by a hypercert. One axis of the impact space and part of the required fields in the hypercerts data standard.

### Scope of impact

A conjunction of potentially-negated impact scope tags, where an empty string means “all”. One axis of the impact space and part of the required fields in the hypercerts data standard.

### Scope of work

A conjunction of potentially-negated work scope tags, where an empty string means “all”. One axis of the impact space and part of the required fields in the hypercerts data standard.

### Splitting hypercerts

An operation to split one hypercert into two or more separate hypercerts, such that the resulting, separated hypercerts cover the exact same region in the impact space that the previous hypercert covered.

### Time of impact

Date ranges from the start to the end of the impact being claimed by a hypercert. One axis of the impact space and part of the required fields in the hypercerts data standard.

### Time of work

A date range, from the start to the end of the work being claimed by a hypercert. One axis of the impact space and part of the required fields in the hypercerts data standard.

### Unit

The smallest possible fraction of a claim. Generally units are grouped in fractions.

### Work

Activities that produce impact.

## Additional Impact Evaluation Terms

### Auditor

Individual, organization, or algorithm that evaluates the impact of work after it is done.

### Beneficiaries

People or objects that are impacted by work.

### Evaluator

Individual, organization, or algorithm that evaluates the impact of work. There are two types: Scouts evaluate the potential impact before it is done, auditors evaluate the impact after it is done.

### Scout

Individual, organization, or algorithm that evaluates the potential impact of work before it is done.
