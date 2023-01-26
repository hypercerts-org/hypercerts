---
title: Scenarios
id: scenarios
sidebar_position: 2
---

Hypercerts are a key building block for an open ecosystem of retrospective funding and tangible impact. This outlines some potential scenarios we're exploring.

## Hypercerts with simple retroactive funding
In the simplest version of hypercerts, retrospective funders use hypercerts to award funding to contributors. 

```mermaid
sequenceDiagram
    participant Contributor
    participant Retrospective Funder
    Note over Contributor: creates public good
    Note over Retrospective Funder: evaluates impact of public good
    Retrospective Funder ->> Contributor: awards funding
    Note over Contributor: mints hypercert
    Contributor -->> Retrospective Funder: awards hypercert
```
If retrospective funding becomes the norm, contributors can reliably expect to get funding for creating positive impact. This expectation incentivizes them to start creating public goods.

However, until it's a norm, we need additional tools to create reliable expectations about future retrospective funding that incentivizes contributors to create public goods. This includes existing mechanisms like prize competitions.

## Prize competition with hypercerts
A funder announces a prize that is given out under specific criteria to create reliable expectations about future retrospective rewards. hypercerts lower transaction costs if multiple funders use these in their prize competitions.

```mermaid
sequenceDiagram
    participant Contributor
    participant Retrospective Funder
    participant Evaluator
    Note over Retrospective Funder: announces prize for impact
    Note over Contributor: mints hypercert
    Contributor -->> Retrospective Funder: submits hypercert
    Retrospective Funder -->> Contributor: accepts hypercert as submission
    Note over Contributor: creates public good
    Note over Evaluator: evaluates impact of public good
    Evaluator -->> Retrospective Funder: informs about evaluation
    Retrospective Funder ->> Contributor: awards funding
    Contributor -->> Retrospective Funder: awards hypercert
```

## Retrospective funding pool
Smaller funders don't have the funds to create the optimal incentives with retrospective rewards. Hence multiple Funders can pool funds to achieve bigger goals. They announce funding criteria to create reliable expectations about future retrospective funding. This incentivizes contributors to start working towards these criteria.

Every funder will receive fractions of the impactful hypercerts to track the impact of their funding.

```mermaid
sequenceDiagram
    participant Contributor
    participant Retrospective funding pool
    participant Funder 1
    participant Funder 2
    Funder 1 ->> Retrospective funding pool: deposits funding
    Funder 2 ->> Retrospective funding pool: deposits funding
    Note over Retrospective funding pool: announces future retrospective funding criteria
    Note over Contributor: creates public good
    Note over Retrospective funding pool: evaluates impact of public good
    Retrospective funding pool ->> Contributor: awards funding
    Note over Contributor: mints hypercert
    Contributor -->> Retrospective funding pool: awards hypercert
    Retrospective funding pool -->> Funder 1: transfers fraction of hypercert
    Retrospective funding pool -->> Funder 2: transfers fraction of hypercert
    
```
## Hypercerts with pro- and retroactive funding
Contributors can't always bootstrap their project without initial funding. When prospective funders are needed, hypercerts make it easy to track their funding and its impacts. 

In some cases the retrospective funder can also reward the prospective funder for making this project happen.

```mermaid
sequenceDiagram
    participant Contributor
    participant Prospective Funder
    participant Retrospective Funder
    Note over Contributor: creates work plan
    Prospective Funder ->> Contributor: awards funding
    Note over Contributor: mints hypercert
    Contributor -->> Prospective Funder: awards fractions of the hypercert
    Note over Contributor: Uses funding to create public good
    Note over Retrospective Funder: evaluates impact of public good
    Retrospective Funder ->> Contributor: awards funding
    Contributor -->> Retrospective Funder: awards fractions of the hypercert
    Note left of Contributor: Optional step:
    Retrospective Funder ->> Prospective Funder: awards funding
    Prospective Funder -->> Retrospective Funder: transfers fractions of hypercert
```
