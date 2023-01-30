---
title: Hypercerts as a data layer
id: hypercerts-as-data-layer
sidebar_position: 3
---

In order for impact funding systems to be most effective, they should be interoperable regarding (1) funding mechanisms, (2) funding sources and (3) evaluations. Figure 1 shows a potential dynamic between the actors of an IFS. In that scenario hypercerts can account for the prospective funding (steps 2-3) as well as for the retrospective funding (steps 8-9) from different funders. Evaluations are made public and can be discovered through the hypercerts for all funders (steps 5-7). Retrospective funders can reward not only the contributors but also the prospective funders (steps 10-11).

```mermaid
sequenceDiagram
    autonumber
    participant Beneficiaries
    participant Contributors
    participant Prospective funders
    participant Retrospective funders
    participant Evaluators
    Contributors ->> Contributors: Mint hypercerts
    Prospective funders ->> Contributors: Award funding
    Contributors ->> Prospective funders: Award fractions of <br> the hypercert
    Contributors ->> Beneficiaries: Create impact
    Retrospective funders ->> Evaluators: Fund evaluation
    Evaluators ->> Beneficiaries: Evaluate impact on beneficiaries
    Evaluators ->> Retrospective funders: Make evaluations  public,<br> esp. for retrospective <br> funders
    Retrospective funders ->> Contributors: Award funding
    Contributors ->> Retrospective funders: Award fractions of hypercerts
    opt
    Retrospective funders ->> Prospective funders: Award funding
    Prospective funders ->> Retrospective funders: Transfer fractions <br> of hypercert
    end
```

By serving as a single, open, shared, decentralized database hypercerts lower the transaction costs to coordinate and fund impactful work together. This is important because the optimal funding decisions of a single funder depends on the funding decision of all other funders. For instance, some work is only impactful if a minimum funding is provided: The impact is non-linear in the funding amount, e.g. half a bridge is not half as impactful as a full bridge. Other work might be over-funded, i.e. the impact of an additional dollar is basically zero. Ultimately, funders want to find the highest impact for each additional dollar spend (cf. S-process as in Critch, 2021). Today multi-funder coordination on impact funding is prohibitively expensive, leading to suboptimal efficiency in impact capital allocation.  Through hypercerts the funding becomes more transparent and the credits for funding impactful work can be easily shared. Coordinating funding becomes easier.

Hypercerts don’t solve this coordination problem by themselves, but build the basis for different decision and funding mechanisms as shown in figure 2. Quadratic voting, bargaining solutions, DAO-style votes, milestone bounties, and simple unconditional grants all have their strengths, among others. Hypercerts do not lock in any particular decision-making scheme for funders.

![Hypercerts as a data layer for an IFS](https://raw.githubusercontent.com/protocol/hypercerts-docs/main/static/img/hypercert_data_layer.png)

Looking farther into the future: If a large majority of funding across an entire IFS ends up flowing through hypercerts, funders have created the transparency that enables each of them to make the best decisions given the funding decision of everyone else.
