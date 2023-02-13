---
title: Metadata Standard
id: metadata
sidebar_position: 2
---

# Hypercert Metadata Structure

Hypercerts are represented as [ERC-1155](https://eips.ethereum.org/EIPS/eip-1155) tokens. All token instances of a hypercert must share the same ERC-1155 metadata. For sites like OpenSea to pull in off-chain metadata for ERC-1155 assets, your hypercert contract will need to return an IPFS URI that contains all necessary hypercert metadata.

The hypercert metadata schema follows the [Enjin recommendation](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1155.md#erc-1155-metadata-uri-json-schema) for ERC-1155 metadata. It also includes **six required dimensions** that are necessary to clearly and unambiguously identify the hypercert's impact claim.

The following are standard ERC-1155 metadata fields.

## ERC-1155 fields

| Property | Description |
| -------- | -------- |
| `name`     | Name or title of the hypercert. Given that a project  may create numerous hypercerts over time, consider giving the hypercert a name that represents a discrete phase or output.|
| `description` | A human readable description of the hypercert. Markdown is supported. Additional external URLs can be added.|
| `image` | A URI pointing to a resource with mime type image/* that represents the hypercert's artwork, i.e., `ipfs://<CID>`. We recommend images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.|
| `external_url` | [optional] A URL that can be displayed next to the hypercert on webpages like OpenSea and links users to a page that has more information about the project or impact claim.|
| `properties` | [optional] Additional properties (aka attributes) that may be helpful for discovery and curation of hypercerts. Marketplaces like OpenSea will display these properties in the same way as they display rarity traits of NFTs. |

In order to perform hypercert-specific operations, including split and merge functions, and for your hypercert to robustly claim a set of  coordinates in the impact space, there are six additional dimensions that must be included in your metadata.

## Required Hypercert dimensions

| Property | Description |
| -------- | -------- |
| `work_scope` | An *ordered list* of work scope tags. Work scopes may also be excluded from the claim. The `¬` prefix will be displayed next to any work scope that is explicitly excluded from the claim. |
| `work_timeframe` | Date range from the start to the end of the work in the form of a [UTC timestamp](https://www.utctime.net/utc-timestamp). |
| `impact_scope` | An *ordered list* of impact scope tags. Impact scopes may also be excluded from the claim. The `¬` prefix will be displayed next to any impact scope that is explicitly excluded from the claim. The default claim is to  "all" impact, giving the owner rights to claim all potential impact created by the work that is represented by the hypercert. |
| `impact_timeframe` | Date range from the start to the end of the impact in the form of a [UTC timestamp](https://www.utctime.net/utc-timestamp). The default claim is from the start date of work until `indefinite` (i.e., the impact may occur at any point in time in the future).|
| `contributors` | An *ordered list* of  all contributors. Contributors should be itemized as wallet addresses or ENS names, but may be names / pseudonyms. The default claim is to the wallet address that created the hypercert contract. A multisig wallet can be used to represent a group of contributors. |
| `rights` | An *unordered list* of usage rights tags. The default claim is solely to "public display" of the hypercert, i.e., all other rights remain with the contributors. |

## Examples

### Example 1: hypercert with minimal bounds

Here is an example of hypercert dimensions for work on IPFS with minimal bounds:

```
"hypercert": {
    "work_scope": {
        "name": "Work Scope",
        "value": ["IPFS"],
        "excludes": [],
        "display_value": "IPFS"
    },
    "impact_scope": {
        "name": "Impact Scope",
        "value": ["All"],
        "excludes": [],
        "display_value": "All"
    },    
    "work_timeframe": {
        "name": "Work Timeframe",
        "value": [1380585600, 1388534399],
        "display_value": "2013-10-01 -> 2013-12-31"
    },
    "impact_timeframe": {
        "name": "Impact Timeframe",
        "value": [1380585600, 0],
        "display_value": "2013-10-01 -> Indefinite"
    },
    "contributors": {
        "name": "Contributors",
        "value": ["Protocol Labs"],
        "display_value": "Protocol Labs"
    },
    "rights": {
        "name": "Rights",
        "value": ["Public Display"],
        "display_value": "Public Display"
    }
}
````

### Example 2: hypercert with bounded impact claims
This hypercert is for a carbon removal project that provides a bounded impact scope.


```
"hypercert": {
    "work_scope": {
        "name": "Work Scope",
        "value": ["Protecting Trees in Amazon"],
        "excludes": [],
        "display_value": "Protecting Trees in Amazon"
    },
    "impact_scope": {
        "name": "Impact Scope",
        "value": ["CO2 in Atmosphere"],
        "excludes": [],
        "display_value": "CO2 in Atmosphere"
    },    
    "work_timeframe": {
        "name": "Work Timeframe",
        "value": [1356998400, 1388534399],
        "display_value": "2013-01-01 -> 2013-12-31"
    },
    "impact_timeframe": {
        "name": "Impact Timeframe",
        "value": [1356998400, 0],
        "display_value": "2013-01-01 -> Indefinite"
    },
    "contributors": {
        "name": "Contributors",
        "value": ["0xa1fa1fa000000000000000000000000000000000", "Project Forest Conservation"],
        "display_value": "0xa1f...000, Project Forest Conservation"
    },
    "rights": {
        "name": "Rights",
        "value": ["Public Display"],
        "display_value": "Public Display"
    }
}
```

### Example 3: hypercert with excluded impact claims
Here is an example that explicitly excludes an impact scope to generate a more fine-grained claim.


```
"hypercert": {
    "work_scope": {
        "name": "Work Scope",
        "value": ["Protecting Trees in Amazon"],
        "excludes": [],
        "display_value": "Protecting Trees in Amazon"
    },
    "impact_scope": {
        "name": "Impact Scope",
        "value": ["All"],
        "excludes": ["CO2 in Atmosphere"],
        "display_value": "All ∧ ¬CO2 in Atmosphere"
    },    
    "work_timeframe": {
        "name": "Work Timeframe",
        "value": [1356998400, 1388534399],
        "display_value": "2013-01-01 -> 2013-12-31"
    },
    "impact_timeframe": {
        "name": "Impact Timeframe",
        "value": [1356998400, 0],
        "display_value": "2013-01-01 -> Indefinite"
    },
    "contributors": {
        "name": "Contributors",
        "value": ["0xa1fa1fa000000000000000000000000000000000", "Project Forest Conservation"],
        "display_value": "0xa1f...000, Project Forest Conservation"
    },
    "rights": {
        "name": "Rights",
        "value": ["Public Display"],
        "display_value": "Public Display"
    }
}
```


### Additional guidelines

Here are some additional guidelines for defining hypercert dimensions.

- For most hypercerts, the `work_scope` is best represented as the name of the project or activity. Other information contained in the hypercert, namely, the `contributors` and the `work_timeframe` should provide sufficient context to disambiguate multiple claims from the same project.
- Similarly, for most hypercerts, the `impact_scope` will be most clearly represented as "all" (with an indefinite upper bound on the `impact_timeframe` dimensions). This gives the hypercert creator and its owners the flexibility to make claims about impact that may not have been observable or well-understood when the hypercert was created.

- It is recommended to browse the `impact_scope` and `work_scope` tags that have already been created and are in use by your or other projects. (We are building a  catalog to be available at [hypercerts.org](https://hypercerts.org).) Picking established tags can make it easier for users to discover, curate, and interact with your hypercert. In the long-run, we expect different ontologies to emerge in domains like climate solutions, open source software, etc, and picking more established tags  will help prevent overlapping or duplicate claims.
-  Tags for work scopes and impact scopes are [logically conjunctive](https://en.wikipedia.org/wiki/Logical_conjunction), e.g. `Planting trees` ∧ `Germany` means that the hypercert includes the planting of trees only in Germany, but not planting trees anywhere else or any other work in Germany that wasn't planting trees.
- Scopes that are explicitly excluded from the hypercert claim are enumerated separately and displayed with the `¬` prefix in the tag. Excluded scopes are not currently displayed on hypercert artwork.
- The order of tags matters only for display purposes. The hypercert artwork will only display a limited number of tags in the `impact_scope` and `work_scope` arrays due to image size and stylistic constraints.
- A `contributor` can be identified using any human-readable string. The base case is to set the `contributors` to the wallet address used to create the hypercert. A multisig wallet can be used to represent a group of contributors.


### Assigning `rights`

In version 1.0 of the protocol, only one `rights` tag will be enabled:

> **Public Display**: owners of the hypercert have the right to publicly display and receive social utility from their hypercert.

This means that any other rights regarding the work described by the hypercert either remain with the original contributors or are governed by other agreements.

Additional `rights` including the potential for certain types of transfers to be explicitly enabled will be released in subsequent versions.

## Optional hidden properties

Creators may wish to add other fields in their metadata that are not a part of the hypercert claim and are not for display on third-party marketplaces like OpenSea. These can be added by creating a `hidden_properties` field in the metadata.
