---
title: Gitcoin Alpha Round
id: gitcoin-round
sidebar_position: 5
---

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
