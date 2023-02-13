---
title: Splitting, Merging, and Other Hypercert Operations
id: operations
sidebar_position: 7
---

### Merging hypercerts
Besides the fungible dimension, hypercerts can be merged and split on any of the six dimensions as shown in box 1. Let us take the hypercert 1 from the section "Hypercerts definition" and focus only on two of the dimensions, scope of work and time of work. These two dimensions create a simplified impact space. The figure below shows how work on IPFS (InterPlanetary File System) could have been minted over time in separate hypercerts, one for each quarter of work.

![minting hypercerts example](../../static/img/creating.png)

We created five hypercerts, one for each quarter of work. As the resulting work of all of these together is IPFS 0.1, the merged hypercert in total is more meaningful and more valuable than just the five individual hypercerts. In this case the proverb is true, the whole is greater than the sum of its parts. Hence, we want to merge them as shown in the next figure.

![merging hypercerts example](../../static/img/merging.png)

### Splitting hypercerts
Conversely, splitting can increase the meaningfulness and value of hypercerts as well. We can split the work on IPFS 0.1 into the conceptual work “invention of IPFS” and the implementation via “go-ipfs 0.1” as shown in the next figure.

![splitting hypercerts examples](../../static/img/splitting.png)

Other use cases are where multiple contributors want to combine their work on the same scope of work (merging) or disentangle their work (splitting). Ultimately, splitting and merging allows users to repackage the digital representation of their work and impact.

Importantly, splitting and merging are the only operations that are permitted to change hypercerts. Once an area in the impact space is claimed, it can not be unclaimed. This ensures that claims are never forgotten.

### Retiring hypercerts
While a claim in the impact space can not be unclaimed, it can be retired. Retiring a hypercert means that owners can not transfer and sell it anymore. This way owners prove that they are the final buyers of the impact. Technically retiring hypercerts means that they are sent to a specific null address, which ensures that the retired hypercerts are recorded and traceable.
