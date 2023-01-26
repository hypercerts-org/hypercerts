---
title: The Hypercert ledger
id: ledger
sidebar_position: 1
---

# The Hypercert ledger

## Introducing the Hypercert ledger

The hypercert ledger is an interoperable data layer for impact-funding mechanisms. The ledger stores tokenized certificates that are NFT-like in some dimensions, but fundamentally are fungible, facilitate allocating retrospective rewards to prospective funders, and facilitate hierarchies of impact assignment and pricing mechanisms. It does all this without imposing any specific mechanisms, thereby facilitating experimentation, but provides baseline invariant guarantees such as that claims will not be forgotten as different mechanisms come into and out of fashion, and enables different kinds of mechanisms to interface naturally with each other.

## Defining Hypercerts

Each hypercert is an impact claim described by (1) the scope of work that has been (or will be) performed in a given time period by a set of specified contributors and (2) the scope of impact that this work has had (or will have) in another given time period. In addition, a hypercert has the potential to declare which rights the owner of the hypercert has, e.g. the right to publicly display the hypercert.

### Examples

|                       | Example 1                     | Example 2                                                                                                                                                                                                                                                                                                                                                      |
|-----------------------|-------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Set of contributors   | Vanessa Kosoy, Alex Appel     | Nelson Elhage, Neel Nanda, Catherine Olsson, Tom Henighan, Nicholas Joseph, Ben Mann, Amanda Askell, Yuntao Bai, Anna Chen, Tom Conerly, Nova DasSarma, Dawn Drain, Deep Ganguli, Zac Hatfield-Dodds, Danny Hernandez, Andy Jones, Jackson Kernion, Liane Lovitt, Kamal Ndousse, Dario Amodei, Tom Brown, Jack Clark, Jared Kaplan, Sam McCandlish, Chris Olah |
| Scope of work         | Research on Infra-Bayesianism | Writing the article “A Mathematical Framework for Transformer Circuits”                                                                                                                                                                                                                                                                                        |
| Time period of work   | 2018-01-01 to 2022-08-25      | 2021-05-01 to 2021-12-22                                                                                                                                                                                                                                                                                                                                       |
| Scope of impact       | AI Existential Safety         | AI Existential Safety                                                                                                                                                                                                                                                                                                                                          |
| Time period of impact | 2022-08-25 to Forever         | 2022-08-25 to Forever                                                                                                                                                                                                                                                                                                                                          |
| Rights                | Public display                | Public display                                                                                                                                                                                                                                                                                                                                                 |
### Design example

![hypercert_example_design](https://raw.githubusercontent.com/protocol/hypercerts-docs/main/static/img/hypercert_example.png)

## Functions of Hypercerts

The main functions of Hypercerts are the following:

1. Identification: The work and impact is unambiguously and permanently identifiable
2. Ownership: The work and impact can be owned (incl. multiple owners with unequal fractions)
3. Rights: Rights regarding the specified work and impact can be transferred to new owners

## Agnostic towards funding mechanism

The Hypercert ledger doesn’t impose any specific impact-funding mechanism. For examples the following types of funding are possible:

- **Grants:** A funder buys a Hypercert from a team before the work has been done without any conditions for the grantee
- **Bounties:** A funder commits – for example via a smart contract – to buy a Hypercert from a project if a clearly defined activity has been performed or an output has been created
- **Retrospective evaluations:** A team creates some impact and mints a Hypercert for it, a funder evaluates it and buys it retrospectively

![hypercert_data_layer](https://raw.githubusercontent.com/protocol/hypercerts-docs/main/static/img/hypercert_data_layer.png)

Beyond the types of funding, funders can, of course, also use different decision mechanisms to determine which Hypercerts they want to buy for which price. This also includes mechanisms such as a third party organizing an auction or other market mechanisms to bring buyers (funders) and sellers (teams) of Hypercerts together.

Hypercerts are also agnostic regarding the funding object. On the one extreme, Hypercerts can describe only the team and include any work in a specified time period and any impact they have. On the other extreme, Hypercerts can describe a very specific impact.
