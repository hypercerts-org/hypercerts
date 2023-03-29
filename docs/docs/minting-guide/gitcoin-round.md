---
title: Gitcoin Alpha Round Instructions
id: gitcoin-round
sidebar_position: 3
---

# Gitcoin Alpha Round Instructions

## Overview

- all projects in the Gitcoin Alpha Round are invited to mint a hypercert for their work
- anyone who gave over $1 to a project is automatically allowlisted for that project’s hypercert
- 50% of each hypercert is distributed to the funders, 50% is kept by the project and can be transferred later
- each project has a custom URL to make minting super easy (the link is sent directly to each project)
- everything runs on Optimism (users only need to pay L2 gas costs)

:::info
If your project participated in the Gitcoin Alpha Round, but you didn't get a message with a custom URL, please reach out to team[at]hypercert.org.
:::

## Hypercerts x Gitcoin Alpha Round

Now that Gitcoin’s Alpha Round has officially closed and the funding distribution is finalized, we are inviting all eligible projects that participated to mint a hypercert for their past work and to allocate fractions of their hypercert to a list of supporters.

We’ve created a dApp that pulls all of the data required to mint your hypercert directly from Gitcoin’s Grant Protocol. You can fine-tune the properties, tweak your artwork, and review the distribution mechanism. Once you’re ready, hit the create button and your hypercert will be released into the ethers!

Once your hypercert has been minted, the people who supported your project with a contribution of at least $1 DAI on Gitcoin’s Alpha Round will be able to connect and claim their fractions.

A few important notes about the Alpha Round:

- The total units of a hypercert is based on the total donations; each funder get awarded units proportional to their donations.
- Transfers will be restricted to one transfer from the project to the supporters.
- There will be no additional rights awarded to the funders except the right to "public display" their support for the project.

## Instructions

The following guidance is only for projects that receive a custom URL that pre-populates the hypercerts form based on their Gitcoin Grants' data.

It explains the default settings in the form and recommends fields that the creator may choose to update or edit.

:::note
Gitcoin Grant hypercerts are for retrospective work, i.e., they are intended to capture work that happened between Gitcoin Grants Round 15 (September 2022) and the Alpha Round (January 2023). Therefore, the work time period is always set to past dates. (You might need to adjust the name and description to also refer to past work only.) We are focusing solely on retrospective hypercerts for this round as part of broader efforts to promote retrospective funding; you can read more about it [in the whitepaper](whitepaper/retrospective-funding.md).
:::

### General Fields

#### Name of Hypercert

This field is set by default to the name of your project on Gitcoin Grants. You can edit this to be more specific. Given that your project may create numerous hypercerts over time, consider giving each hypercert a name that represents a more discrete phase or output.

#### Logo

This field is set to the icon artwork provided for your project on Gitcoin Grants. If there was an error accessing your icon, you will see a generic icon.

You can update this by providing a new URL and the hypercert artwork should update automatically.

Logo images look best with an aspect ratio of 1.0 (square-shaped).

#### Background Banner Image

This field is set to the banner artwork provided for your project on Gitcoin Grants. If there was an error accessing your banner, you will see a generic Gitcoin banner.

You can update this by providing a new URL and the hypercert artwork should update automatically.

Banner images look best with an aspect ratio of 1.5 (e.g., 600 x 400 pixels). The dimensions should be at least 320 pixels wide and 214 pixels high to avoid stretching.

#### Project Description

This field is set by default to the description of your project on Gitcoin Grants. Review closely -- a long project description in your Gitcoin Grant description will be truncated.

You may edit this to provide more details about your work and to remove information that is targeted solely at Gitcoin Grants users. This is also a good place to provide other links, such as Github repos or social media accounts, where the general public can learn more about the work. Please aim for a project description that is less than 500 characters.

:::note
The project description should refer to **past work**, not future work that you would like to do with additional funding.
:::

#### Link

This field is set to the first external URL provided for your project on Gitcoin Grants. You can update this.

### Hypercert Fields

#### Work Scope

This field is set by default to a **shortened version** of the name of your project on Gitcoin Grants. You may edit or add additional work scope tags.

For most projects, it's probably best just to use a single tag that is a short form of your project's name. Given that your project may create numerous hypercerts over time, having a work scope that represents the name of your project will make your claims in the "impact hyperspace" more continuous.

If you choose to use more than one tag, remember that tags are [logically conjunctive](https://en.wikipedia.org/wiki/Logical_conjunction), e.g. `Planting trees` ∧ `Germany` means that the hypercert includes the planting of trees only in Germany, but not planting trees anywhere else or any other work in Germany that wasn't planting trees.

#### Work Start/End Dates

The start date has been set by default to the `2022-09-22` for all projects on Gitcoin Grants. This date coincides with the end of Gitcoin Grants Round 15.

The end date references the last update to your grant page on Gitcoin Grants.

You may edit or update these fields, however, the end date may not extend beyond `2023-01-31` (the close of the funding round) as all hypercerts will be retrospective in this round.

#### Set of Contributors

This field is set by default to the wallet address that is set as the recipient address for receiving Gitcoin Grants funding.

:::note
You should review this field closely and – if applicable – provide the addresses of additional contributors.
:::

### Advanced Fields

#### Impact Scope

This field is set by default to `all`.

Updates are currently disabled on the frontend because funding decisions on Gitcoin Grants were not specific to an impact scope or impact time period.

#### Impact Start/End Dates

This field is set by default to the work start date of `2022-09-22` (see above) and a work end date of `indefinite`. Updates are currently disabled on the frontend.

#### Rights

This field is set by default to `Public Display`, i.e., the owners are allowed to publicly display the hypercert and show their support of the work.

Updates are currently disabled on the frontend.

### Distribution

#### Allowlist

This field is set by default to a custom allowlist generated for each project based on the funding it received on the Gitcoin Grants Alpha Round. You should not need to update this field. If there is a problem with your allowlist, please contact us.

50% of the hypercert will be allocated according to this allowlist. The other 50% will be kept by the project, i.e. it is allocated to the address that mints the hypercert. You will be able to transfer or sell these fractions later as long as they are owned by the minter. This means that they can only be transferred or sold once.

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

Donors who contributed to the matching pool for each round are also eligible to claim hypercerts.

:::note
You are free to edit your allowlist. You can do this by following the step-by-step instructions [here](minting-guide/step-by-step.md). Just remember that you will need to upload the new allowlist in a CSV format to a storage site like [web3.storage](https://web3.storage) and then update the link in the allowlist field. Contact team[at]hypercerts.org if you need help.
:::

### Confirmations

#### Contributors' permission

Every contributor needs to agree to have their contribution be represented by a hypercert. This is why the person minting the hypercert has to confirm to have the permission of all listed contributors.

#### Terms & Conditions

The terms & Conditions can be found [here](https://hypercerts.org/terms).

### Final step: Click "Create"

Make sure your Optimism wallet or multi-sig is connected. Click on "create" and wait for your hypercert to be created. Congratulations!
