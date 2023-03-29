---
title: Step-by-step Instructions
id: step-by-step
sidebar_position: 2
---

# Step-by-step instructions

First, go to the [Create Hypercert](https://hypercerts.org/app/create) site with a wallet-enabled browser or follow the custom URL you received to access a prepopulated form.

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

A valid URL for the project, beginning with https://

This will be displayed next to the hypercert on webpages like OpenSea and should link users to a page that has more information about the project or impact claim.

#### Logo

An icon for the top left part of the card. This could be your project logo. It will be automatically masked to the shape of a circle.

Logo images look best with an aspect ratio of 1.0 (square-shaped).

The easiest way is to find an image you like in your web browser, right click "Copy Image Address", and paste it in the field. Images stored on IPFS should be referenced through a hosted URL service, e.g., `https://cloudflare-ipfs.com/ipfs/<CID>`.

#### Background Banner Image

A background image that will extend across the upper half of the artwork. This could be your project masthead or a unique piece of art.

Banner images look best with an aspect ratio of 1.5 (e.g., 600 x 400 pixels). The dimensions should be at least 320 pixels wide and 214 pixels high to avoid stretching.

Currently we don't support zoom / cropping, so you will need to test the look and feel on your own.

The easiest way is to find an image you like in your web browser, right click "Copy Image Address", and paste it in the field. Images stored on IPFS should be referenced through a hosted URL service, e.g., `https://cloudflare-ipfs.com/ipfs/<CID>`.

### Work Scope fields

#### Work Scope

One or multiple tags describe the work that the hypercert represents. This work scope will be used to identify the work that is included in the hypercerts and the work that is not included.

Multiple tags are [logically conjunctive](https://en.wikipedia.org/wiki/Logical_conjunction), e.g. `Planting trees` ∧ `Germany` means that the hypercert includes the planting of trees only in Germany, but not planting trees anywhere else or any other work in Germany that wasn't planting trees.

For most projects, it's probably best just to use a single tag that is a short form of your project's name. Given that your project may create numerous hypercerts over time, having a work scope that represents the name of your project will make your claims in the "impact hyperspace" more continuous.

_Note: In the future, you will be able to specifically exclude work from the hypercert._

#### Start and End Date of Work

The work time period defines when the work was done that the hypercert represents, i.e., only the work in this time period is included in the hypercert.

The time period of work doesn't need to be the start and end date of a project, but it can be. One project can be split up into multiple hypercerts, e.g. all hypercerts can have the same `work scope`, but different time periods of work. Of course, the time periods are not allowed to overlap.

### Impact scope fields

#### Impact Scope

The impact scope can be used to limit the impact that a hypercert represents, e.g. for the work scope `Planting trees` a hypercert can represent _only_ the impact on biodiversity by including the impact scope tag `Biodiversity`. This would exclude all other impacts, including the impact on CO2 in the atmosphere, which can be useful if that impact is already captured by a carbon credit.

By default this is set to "`all`" and we strongly recommend keeping it that way.

Just like the work scope, multiple impact scope tags are [logically conjunctive](https://en.wikipedia.org/wiki/Logical_conjunction).

#### Start and End Date of Impact

The impact time period is another way to limit the impact that a hypercert represents, e.g. inventing a new medical treatment has a positive impact over many years, but we might want to capture the positive impact separately for each year.

By default the `impact start date` is the same as the `work start date` and the `impact end date` is "`indefinite`", i.e., the impact is not restricted time-wise. We strongly recommend keeping it that way.

### Set of Contributors

Provide a list of contributors, one per line, or comma-separated.

The list should include _all_ contributors that performed the described work.

Contributors are generally itemized as wallet addresses or ENS names, but can also be names / pseudonyms. Groups of contributors can be represented by a multisig or name of an organization.

### Owners

#### Allowlist

The allowlist allocates fractions of the hypercert to specific wallet addresses. These wallet addresses are then allowed to claim these fractions afterwards. For example, it can be used to allocate fractions to previous funders and contributors.

The allowlist is implemented as a CSV file specifying `index,address,price,fractions` headers.

| index | address                                    | price | fractions |
| ----- | ------------------------------------------ | ----- | --------- |
| 0     | 0x5dee7b340764c49a827c60d2b8729e49405fbefc | 0.0   | 100       |
| 1     | 0x1e2dbb9ca3f6d48e085384a821b7259abfdc7d65 | 0.0   | 50        |
| ...   | ...                                        | ...   | ...       |
| 999   | 0x436bad18642f45d3fa5fcaad0a2d81764a9cba85 | 0.0   | 1         |

The `price` field is denominated in ETH. This should remain at 0.0 for all hypercerts, as primary sales are not currently supported through the app and the secondary sale/transfer of hypercerts is currently not allowed.

You can store your allowlists on IPFS using [web3.storage](https://web3.storage/).

:::note
If your allowlist is not properly formatted, you will be unable to mint your hypercert. If you do not include an allowlist, then the creator of the hypercert will receive 100% of the hypercert (set to a default of 10,000 units), which you can then sell or transfer to another wallet a maximum of one time.
:::

#### Rights

This field defines the rights that owners of the hypercert have over the work being claimed by this hypercert.

By default this is set to `Public Display`, i.e., the owners are allowed to publicly display the hypercert and show their support of the work.

_Note: In the future, additional rights can be included for different hypercerts._
