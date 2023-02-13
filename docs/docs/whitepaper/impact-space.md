---
title: A Consistent Impact Space
id: impact-space
sidebar_position: 4
---

Every hypercert represents a claim in the impact space, which itself represents all possible claims. Above we illustrated the impact space with two dimensions, scope and time of work. The complete impact space is spanned by the six dimensions introduced in the definition of hypercerts.

### Consistency of the impact space

Every point in the impact space should either be claimed or not be claimed. No point must be claimed twice, or equivalently:
- If the impact of some work is represented in one hypercert, it must not be part of any other hypercert.
- Hypercerts must not overlap with each other.

The table below shows two hypercerts that were illustrated in the section on "Hypercerts operations", but now with all six fields. The two hypercerts can represent the exact same work by the same contributor, but they do not overlap because of the difference in the time of work.

|                         | **Hypercert 7**          | **Hypercert 8**          |
|-------------------------|--------------------------|--------------------------|
| **Set of contributors** | Contributor 1            | Contributor 1            |
| **Scope of work**       | IPFS                     | IPFS                     |
| **Time of work**        | 2013-10-01 to 2013-12-31 | 2014-01-01 to 2014-03-31 |
| **Scope of impact**     | all                      | all                      |
| **Time of impact**      | 2013-10-01 → indefinite  | 2014-01-01 → indefinite  |
| **Rights**              | None                     | None                     |

The consistency of the impact space is crucial as it ensures that no rights to an impact claim are sold twice. If for example someone owns the right to retrospective rewards for the impact of some work, the owners must be identifiable unambiguously.

Because users can create hypercerts with arbitrary data on any chain, on which a hypercert contract is deployed, we provide ways to help users detect collisions in the impact space. For example, if one hypercert on Ethereum points to the work on “IPFS”, and another hypercert on Filecoin points to the work on “https://github.com/ipfs/go-ipfs” both with the same contributor and time of work, which of these overlapping hypercerts is the correct one to support? To surface such overlapping hypercerts, the hypercerts protocol and SDK will support mechanisms to index, search, and visualize neighbors in the impact space. With these tools evaluators can quickly detect potential conflicts  and submit the results as evaluations to help disambiguate proper credit and attribution.

### Emerging ontologies
Common ontologies for the scope of work and scope of impact are useful to create transparency and improve discoverability. Such ontologies need to be created from the practices and should be adapted over time. They are like emerging norms, instead of fixed rules. However, some larger players or a group of smaller players could enforce certain ontologies, e.g. if multiple funders agree that they only fund projects that follow a specified ontology.

As some ontologies might be more useful than others, we would ideally see a consensus emerge between participants and experts in each impact area. Decentralized governance institutions can help facilitate this; however, further details on the design are out of the scope of this paper and are left for future work.
