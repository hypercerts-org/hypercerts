---
title: Glossary of Terms
id: glossary
sidebar_position: 3
---

# Glossary for Hypercerts

<dl>
  <dt><strong>Allowlist</strong></dt>
  <dd>A list that allocates – mostly at the time of minting a hypercert – fractions of hypercerts to new owners. Based on allowlists designated new owners can claim their fractions. </dd>
  <dt><strong>Auditor</strong></dt>
  <dd>Individual, organization, or algorithm that evaluates the impact of work after it is done.</dd>
  <dt><strong>Beneficiaries</strong></dt>
  <dd>People or objects that are impacted by work.</dd>
  <dt><strong>Claiming a fraction</strong></dt>
  <dd>Transferring the ownership of a fraction of a hypercert from a previous owner to oneself after the previous owner specified the new owners and their respective fractions in an allowlist.</dd>
  <dt><strong>Contributor</strong></dt>
  <dd>Individual or organization that performs the work described in a hypercert.</dd>
  <dt><strong>Creating a hypercert</strong></dt>
  <dd>Synonymous to minting a hypercert.</dd>
  <dt><strong>Evaluator</strong></dt>
  <dd>Individual, organization, or algorithm that evaluates the impact of work. There are two types: Scouts evaluate the potential impact before it is done, auditors evaluate the impact after it is done.</dd>
  <dt><strong>Fraction</strong></dt>
  <dd>A token that represents a quantified proportion of a hypercert.</dd>
  <dt><strong>Funder</strong></dt>
  <dd>Individual, organization, or algorithm that funds work. There are two types: Prospective funders fund work before the work is done, retrospective funders fund the work after the work is done.</dd>
  <dt><strong>Hypercert</strong></dt>
  <dd>A token that (1) accounts for work that is supposed to be impactful, (2) represents the – potentially explicitly specified – impact of this work, and (3) assigns right over this work to its owners. If a hypercert is split into multiple fractions, the hypercert refers to the sum of all of its fractions. Hypercert also refers to the hypercert standard that defines the token and data standard for hypercerts.</dd>
  <dt><strong>Hypercerts standard</strong></dt>
  <dd>A token and data standard for hypercerts. The token standard builds on the [ERC-1155](https://eips.ethereum.org/EIPS/eip-1155) token. The first 128 bits of the 256-bit token ID identifies the hypercert, the latter 128 bits identifies the specific fraction. The data standard requires that the following fields are defined on the metadata of the token: (1) set of contributors, (2) scope of work, (3) time of work, (4) scope of impact, (5) time of impact, (6) rights.</dd>
  <dt><strong>Impact</strong></dt>
  <dd>Value that is created or destroyed by work. It mostly refers to value that is created. If work destroy value, it is referred to as negative impact.</dd>
  <dt><strong>Impact evaluation</strong></dt>
  <dd>A claim that a specified impact has or will occur – potentially claiming which work was responsible for the impact.</dd>
  <dt><strong>Impact Funding System (IFS)</strong></dt>
  <dd>A system of actors (contributors, evaluators, funders) that interact according to a set of rules (funding mechanisms, coordination mechanisms) to maximize the domain-specific impact.
  </dd>
  <dt><strong>Impact space</strong></dt>
  <dd>A geometrical space representing all possible work with its associated impact and rights. The space is spanned by the six fields specified in the hypercerts data standard: (1) set of contributors, (2) scope of work, (3) time of work, (4) scope of impact, (5) time of impact, (6) rights.</dd>
  <dt><strong>Minting a hypercert</strong></dt>
  <dd>Creating a new record for a hypercert on a blockchain.</dd>
  <dt><strong>Project</strong></dt>
  <dd>Work by one or more contributors to achieve a goal. A project does not need to be represented by one hypercert, but can be represented by multiple hypercerts or one hypercert can represent multiple projects or parts thereof.</dd>
  <dt><strong>Prospective funder</strong></dt>
  <dd>Individual, organization, or algorithm that fund work before it is done.</dd>
  <dt><strong>Retrospective funder</strong></dt>
  <dd>Individual, organization, or algorithm that fund work after it is done.</dd>
  <dt><strong>Rights</strong></dt>
  <dd>An unordered list of usage rights tags, which define the rights of the owners of a hypercert over the work being claimed by a hypercert. One of the axis of the impact space and part of the required fields in the hypercerts data standard.</dd>
  <dt><strong>Set of contributors</strong></dt>
  <dd>An ordered list of all contributors, who claim to do or have done the work described by a hypercert. One of the axis of the impact space and part of the required fields in the hypercerts data standard.</dd>
  <dt><strong>Scope of impact</strong></dt>
  <dd>A conjunction of potentially-negated impact scope tags, where an empty string means “all”:
  One of the axis of the impact space and part of the required fields in the hypercerts data standard.</dd>
  <dt><strong>Scope of work</strong></dt>
  <dd>A conjunction of potentially-negated work scope tags, where an empty string means “all”:
  One of the axis of the impact space and part of the required fields in the hypercerts data standard.</dd>
  <dt><strong>Scout</strong></dt>
  <dd>Individual, organization, or algorithm that evaluates the potential impact of work before it is done.</dd>
  <dt><strong>Time of impact</strong></dt>
  <dd>Date ranges from the start to the end of the impact being claimed by a hypercert. One of the axis of the impact space and part of the required fields in the hypercerts data standard.</dd>
  <dt><strong>Time of work</strong></dt>
  <dd>A date range, from the start to the end of the work being claimed by a hypercert. One of the axis of the impact space and part of the required fields in the hypercerts data standard.</dd>
  <dt><strong>Work</strong></dt>
  <dd>Activities that produce impact.</dd>
</dl>
