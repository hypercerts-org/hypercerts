---
title: Minting Guide
id: minting-guide
sidebar_position: 2
---

# Hypercerts Minting Guide

## Getting started

### How to create a hypercert

Creating a hypercert is similar to creating an NFT on sites like OpenSea or Zora.

In this article, we’ll walk through the steps one by one and explain exactly what you need to do to create your first hypercert.

There are typically two ways of creating a hypercert:
1. As a project affiliated with a specific funding network (e.g., Gitcoin Grants): In this case, you should receive a custom URL from the funding network that pre-populates most of your hypercert fields. You will still be able to change most of these, so you should review and adjust them as needed to better describe your hypercert. Guidance on how to do so (for Gitcoin Grants projects) is provided at the end of this doc.
2. As a project not affiliated with a specific funding network: In this case, you will be creating a hypercert from scratch and filling in each field on your own. Read on below.

### Who can create a hypercert?

Anyone doing work that is intended to have a positive impact can create a hypercert. Your hypercert can be as simple as "I did X on this date and want to claim all future impact from it".

It can also represent something more, such as a phase in an ongoing team project, an invention or discovery, a research publication, or an important software release.

Critically, if the work was done by more that one person, then each person should be listed as a contributor to the hypercert and approve the creation of the hypercert.

*Note: In the future, the approval of each contributor will be verified on-chain.*

### What do I need to create a hypercert?

You will need to prepare all of the information required in the form builder (see **Step-by-step instructions for creating a hypercert** below). This includes important metadata, such as a description of the project and the dimensions of your impact claim, as well as a project artwork. You may also want to include an allowlist of wallets that are approved to claim one or more fractions of the hypercert.

In addition to the information regarding the hypercert itself, you’ll need a crypto wallet to mint your hypercert. “Minting” a hypercert is the process of writing an impact claim to the blockchain. This establishes its immutable record of authenticity and ownership.

Next, choose a blockchain on which to mint your hypercert. The hypercerts protocol is available on Ethereum, Goerli (testnet), and Optimism. Each of these blockchains has different gas fees associated with transactions on their networks. To reduce gas fees we recommend Optimism for most projects.

Finally, go ahead and create your hypercert.

### How much does it cost to create a hypercert?

You will need enough Ethereum in your wallet to cover gas fees. In our simulations, the gas fee for minting a hypercert on Ethereum Mainnet ranged from 2,707,282 to 7,515,075 gwei (0.0027 to 0.0075 ETH). Minting costs are significantly cheaper on Optimism (i.e., below 0.0005 ETH or less than $1).

The protocol currently does not offer gas-free or "lazy" minting.

## Step-by-step instructions

First, go to the [Create Hypercert](https://hypercerts.vercel.app/hypercerts/create) site with a wallet-enabled browser or follow the custom URL you received to access a prepopulated form.

Although the site works on mobile, it is easier to use on desktop because the browser will display a dynamic preview of the hypercert while you fill out the Create form.

Next, connect your wallet. You will be prompted to switch to the Ethereum or Optimism network.

Once you've connected, you will see an empty form for creating a hypercert.

### General fields

#### Name of Hypercert
Enter the name or title of the hypercert. This is the place to be verbose and specific about what the project is doing. You'll see on the preview when your title becomes too long.

Given that a project may create numerous hypercerts over time, consider giving the hypercert a name that represents a discrete phase or output.

Names are restricted to 100 characters but may include emojis (:smile:), accents (é), non-Latin scripts (表情), and other Unicode characters.

#### Project Description

Enter a human readable description of the hypercert. This is the place to share more details about the work and the team or individual behind the work.

The description field supports [Markdown syntax](https://www.markdownguide.org/cheat-sheet/) and has a limit of 10,000 characters.

In addition to the main link (see next field) you can add further links in the markdown to help others to understand the work of the project.

#### Link

A valid URL for the project, begining with https://

This will be displayed next to the hypercert on webpages like OpenSea and should link users to a page that has more information about the project or impact claim.

#### Logo

An icon for the top left part of the card. This could be your project logo. It will be automatically masked to the shape of a circle.

Images stored on IPFS should be referenced through a hosted URL service, e.g., `https://cloudflare-ipfs.com/ipfs/<CID>`.

#### Background Banner Image

A background image that will extend across the upper half of the artwork. This could be your project masthead or a unique piece of art.

We recommend using a picture with dimensions of at least 512 x 342 pixels.

Currently we don't support zoom / cropping, so you will need to test the look and feel on your own.

Images stored on IPFS should be referenced through a hosted URL service, e.g., `https://cloudflare-ipfs.com/ipfs/<CID>`.

### Work Scope fields

#### Work Scope

One or multiple tags describe the work that the hypercert represents. This work scope will be used to identify the work that is included in the hypercerts and the work that is not included.

Multiple tags are [logically conjunctive](https://en.wikipedia.org/wiki/Logical_conjunction), e.g. `Planting trees` ∧ `Germany` means that the hypercert includes the planting of trees only in Germany, but not planting trees anywhere else or any other work in Germany that wasn't planting trees.

We recommend just a short form of the project name as a single tag. In most cases that will be sufficient.

*Note: In the future, you will be able to specifically exclude work from the hypercert.*

#### Start and End Date of Work

The work time period defines when the work was done that the hypercert represents, i.e., only the work in this time period is included in the hypercert.

The time period of work doesn't need to be the start and end date of a project, but it can be. One project can be splitted up into multiple hypercerts, e.g. all hypercerts can have the same `work scope`, but different time periods of work. Of course, the time periods are not allowed to overlap.

### Impact scope fields

#### Impact Scope

The impact scope can be used to limit the impact that a hypercert represents, e.g. for the work scope `Planting trees` a hypercert can represent *only* the impact on biodiversity by including the impact scope tag `Biodiversity`. This would exclude all other impacts, including the impact on CO2 in the atmosphere, which can be useful if that impact is already captured by a carbon credit.

By default this is set to "`all`" and we strongly recommend keeping it that way.

Just like the work scope, multiple impact scope tags are [logically conjunctive](https://en.wikipedia.org/wiki/Logical_conjunction).

#### Start and End Date of Impact

The impact time period is another way to limit the impact that a hypercert represents, e.g. inventing a new medical treatment has a positive impact over many years, but we might want to capture the positive impact separately for each year.

By default the `impact start date` is the same as the `work start date` and the `impact end date` is "`indefinite`", i.e., the impact is not restricted time-wise. We strongly recommend keeping it that way.

### Set of Contributors

Provide a list of contributors, one per line, or comma-separated.

The list should include *all* contributors that performed the described work.

Contributors are generally itemized as wallet addresses or ENS names, but can also be names / pseudonyms. Groups of contributors can be represented by a multisig or name of an organization.

### Owners

#### Allowlist

The allowlist allocates fractions of the hypercert to specific wallet addresses. These wallet addresses are then allowed to claim these fractions afterwards. For example, it can be used to allocate fractions to previous funders and contributors.

The allowlist is implemented as a CSV file specifying `index,address,price,fractions` headers.

|index | address | price | fractions |
| -------- | -------- | -------- | -------- |
|0|0x5dee7b340764c49a827c60d2b8729e49405fbefc|0.0|100|
|1|0x1e2dbb9ca3f6d48e085384a821b7259abfdc7d65|0.0|50|
|...|...|...|...|
|999|0x436bad18642f45d3fa5fcaad0a2d81764a9cba85|0.0|1|

The `price` field is denominated in ETH. This should remain at 0.0 for all hypercerts, as primary sales are not currently supported through the app and the secondary sale/transfer of hypercerts is currently not allowed.

#### Rights

This field define the rights that owners of the hypercert have over the work being claimed by this hypercert.

By default this is set to `Public Display`, i.e., the owners are allowed to publicly display the hypercert and show their support of the work.

*Note: In the future, additional rights can be included for different hypercerts.*

## Create a hypercert for a Gitcoin Grant

The following guidance is only for projects that receive a custom URL that pre-populates the hypercerts form based on their Gitcoin Grants' data.

It explains the default settings in the form and recommends fields that the creator may choose to update or edit.

*Note: Gitcoin Grant hypercerts are for retrospective work, i.e., they are intended to capture work that happened between Gitcoin Grants Round 15 (September 2022) and the Alpha Round (January 2023). Therefore, the work time period is always set to past dates. (You might need to adjust the name and description to also refer to past work only.) We are focusing solely on retrospective hypercerts for this round as part of broader efforts to promote retrospective funding; you can read more about it* **link to be added**.

#### Name of Hypercert
This field is set by default to the name of your project on Gitcoin Grants. You can edit this to be more specific. Given that your project may create numerous hypercerts over time, consider giving each hypercert a name that represents a more discrete phase or output.

#### Project Description
This field is set by default to the description of your project on Gitcoin Grants. You may edit this to provide more details about your work and to remove information that is targeted solely at Gitcoin Grants users. This is also a good place to provide other links, such as Github repos or social media accounts, where the general public can learn more about the work.

The project description should refer to **past work**, not future work that you would like to do with additional funding.

#### Link
This field is set to the first external URL provided for your project on Gitcoin Grants. You can update this.

#### Logo
This field is set to the icon artwork provided for your project on Gitcoin Grants. If there was an error accessing your icon, you will see a generic icon.

You can update this by providing a new URL and the hypercert artwork should update automatically.

#### Background Banner Image
This field is set to the banner artwork provided for your project on Gitcoin Grants. If there was an error accessing your banner, you will see a generic Gitcoin banner.

You can update this by providing a new URL and the hypercert artwork should update automatically.

#### Work Scope
This field is set by default to a **shortened version** of the name of your project on Gitcoin Grants. You may edit or add additional work scope tags.

#### Work Start/End Dates

The start date has been set by default to the `2022-09-22` for all projects on Gitcoin Grants. This date coincides with the end of Gitcoin Grants Round 15.

The end date references the last update to your grant page on Gitcoin Grants.

You may edit or update these fields, however, the end date may not extend beyond `2023-01-31` (the close of the funding round) as all hypercerts will be retrospective in this round.

#### Impact Scope
This field is set by default to `all`.

Updates are currently disabled on the frontend because funding decisions on Gitcoin Grants were not specific to an impact scope or impact time period.

#### Impact Start/End Dates
This field is set by default to the work start date of `2022-09-22` (see above) and a work end date of `indefinite`. Updates are currently disabled on the frontend.

#### Set of Contributors
This field is set by default to the wallet address that is set as the recipient address for receiving Gitcoin Grants funding. **You should review this field closely and – if applicable – provide the addresses of additional contributors.**

#### Allowlist
This field is set by default to a custom allowlist generated for each project based on the funding it received on the Gitcoin Grants Alpha Round. This field should not be changed. If there is a problem with your allowlist, please contact us.

The formula assigns one fraction (rounded down) for every $1 (using the exchange rate at the time of the transaction) that a donor contributed to the project. It also provides a small buffer (of 5%) so that a transaction worth $0.999 or $0.951 remains eligible for one fraction.

For example:

- $5.60 donated --> 5 fractions
- $5.20 donated --> 5 fractions
- $0.96 donated --> 1 fraction
- $0.52 donated --> 0 fractions

The queries used to generate the allowlists can be viewed here:

- ETH Infra: https://dune.com/queries/1934656
- Climate: https://dune.com/queries/1934689
- OSS: https://dune.com/queries/1934969

#### Rights

This field is set by default to `Public Display`, i.e., the owners are allowed to publicly display the hypercert and show their support of the work.

Updates are currently disabled on the frontend.
