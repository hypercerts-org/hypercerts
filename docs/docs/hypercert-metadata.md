---
title: Metadata
id: metadata
sidebar_position: 9
---

# Hypercert Metadata Structure

Hypercerts are represented as [ERC-1155](https://eips.ethereum.org/EIPS/eip-1155) tokens. All token instances of a hypercert must share the same ERC-1155 metadata. For sites like OpenSea to pull in off-chain metadata for ERC-1155 assets, your hypercert contract will need to return an IPFS URI that contains all necessary hypercert metadata.

The hypercert metadata schema follows the [Enjin recommendation](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1155.md#erc-1155-metadata-uri-json-schema) for ERC-1155 metadata. It also includes **six required dimensions** that are necessary to establish the hypercert's claim on the overall impact space.

The following are standard ERC-1155 metadata fields.

## ERC-1155 fields

| Property | Description |
| -------- | -------- |
| `name`     | Name of the hypercert. Given that a project  may create numerous hypercerts over time, consider giving the hypercert a name that represents a discrete phase or output.|
| `description` | A human readable description of the hypercert. Markdown is supported. Additional external URLs can be added.|
| `image` | A URI pointing to a resource with mime type image/* that represents the hypercert's artwork, i.e. `ipfs://<CID>`. We recommend images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.|
| `external_url` | [optional] A URL that can be displayed next to the hypercert on webpages like OpenSea and links users to a page that has more information about the project or impact claim.|
| `background_color` | [optional] Background color of the item for display on OpenSea. Must be a six-character hexadecimal without a pre-pended #.|
| `properties` | [optional] Additional properties (aka attributes) that may be helpful for discovery and curation of hypercerts. Marketplaces like OpenSea will display these properties in the same way as they display rarity traits of NFTs. |

In order to perform hypercert-specific operations, including split and merge functions, and for your hypercert to robustly claim a set of  coordinates in the impact space, there are six additional dimensions that must be included in your metadata.

## Required Hypercert dimensions

| Property | Description |
| -------- | -------- |
| `impact_scope` | An *ordered list* of impact scope tags. The `¬` prefix may be used to indicate an impact scope that is explicitly excluded from the claim. The default claim is to  "all" impact, giving the owner rights to claim all potential impact created by the work that is represented by the hypercert. |
| `work_scope` | An *ordered list* of work scope tags. The `¬` prefix may be used to indicate a work scope that is explicitly excluded from the claim. |
| `work_timeframe` | Date range from the start to the end of the work in the form of a [UTC timestamp](https://www.utctime.net/utc-timestamp).
| `impact_timeframe` | Date range from the start to the end of the impact in the form of a [UTC timestamp](https://www.utctime.net/utc-timestamp). The default claim is from the start date of work until `indefinite` (ie, the impact may occur at any point in time in the future).|
| `contributors` | An *ordered list* of  all contributors. Contributors should be itemized as wallet addresses or ENS names, but may be names / pseudonyms. The default claim is to the wallet address that created the hypercert contract. A multisig wallet can be used to represent a group of contributors. |
| `rights` | An *unordered list* of usage rights tags. The default claim is solely to "public display" of the hypercert, i.e. all other rights remain with the contributors.|

### Example 1: hypercert with minimal bounds

Here is an example of hypercert dimensions for work on IPFS with minimal bounds:

```
"hypercert": {
    "impact_scope": {
        "name": "Impact Scope",
        "value": ["all"],
        "display_value": "All"
    },
    "work_scope": {
        "name": "Work Scope",
        "value": ["IPFS"],
        "display_value": "IPFS"
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
        "value": ["public display", "¬transfers"],
        "display_value": "Public Display (excludes Transfers)"
    }
}
````

### Example 2: hypercert with bounded impact claims
This hypercert is for a carbon removal project that provides a bounded impact scope and timeframe.


```
"hypercert": {
    "impact_scope": {
        "name": "Impact Scope",
        "value": ["CO2 in atmosphere"],
        "display_value": "CO2 in Atmosphere"
    },
    "work_scope": {
        "name": "Work Scope",
        "value": ["protecting trees in Amazon"],
        "display_value": "Protecting Trees in Amazon"
    },
    "work_timeframe": {
        "name": "Work Timeframe",
        "value": [1356998400, 1388534399],
        "display_value": "2013-01-01 -> 2013-12-31"
    },
    "impact_timeframe": {
        "name": "Impact Timeframe",
        "value": [1356998400, 1388534399],
        "display_value": "2013-01-01 -> 2013-12-31"
    },
    "contributors": {
        "name": "Contributors",
        "value": ["0xa1fa1fa000000000000000000000000000000000", "Project Forest Conservation"],
        "display_value": "0xa1f...000, Project Forest Conservation"
    },
    "rights": {
        "name": "Rights",
        "value": ["public display", "¬transfers"],
        "display_value": "Public Display (excludes Transfers)"
    }
}
```

### Example 3: hypercert with excluded impact claims
The example below includes a `¬` operator in the impact scope tags to demonstrate how specific scopes may be *excluded* from a claim. Such logic may be necessary to generate a more fine-grained claim. Tags in both the impact scopes and work scopes are *conjuctive*, meaning a value of `["ScopeX", "ScopeY"]` is interpreted as `"ScopeX and ScopeY"` and a value of `["ScopeX", "¬ScopeY"]` is interpreted as `"ScopeX and not ScopeY"` or `"ScopeX (excludes ScopeY)"`.


```
"hypercert": {
    "impact_scope": {
        "name": "Impact Scope",
        "value": ["All", "¬CO2 in atmosphere"],
        "display_value": "All (excludes CO2 in Atmosphere)"
    },
    "work_scope": {
        "name": "Work Scope",
        "value": ["protecting trees in Amazon"],
        "display_value": "Protecting Trees in Amazon"
    },
    "work_timeframe": {
        "name": "Work Timeframe",
        "value": [1356998400, 1388534399],
        "display_value": "2013-01-01 -> 2013-12-31"
    },
    "impact_timeframe": {
        "name": "Impact Timeframe",
        "value": [1356998400, 1388534399],
        "display_value": "2013-01-01 -> 2013-12-31"
    },
    "contributors": {
        "name": "Contributors",
        "value": ["0xa1fa1fa000000000000000000000000000000000", "Project Forest Conservation"],
        "display_value": "0xa1f...000, Project Forest Conservation"
    },
    "rights": {
        "name": "Rights",
        "value": ["public display", "¬transfers"],
        "display_value": "Public Display (excludes Transfers)"
    }
}
```


### Additional guidelines

Here are some additional guidelines for defining hypercert dimensions.

- For most hypercerts, the `work_scope` is best represented as the name of the project or activity. Other information contained in the hypercert, namely, the `contributors` and the `work_timeframe` should provide sufficient context to disambiguate multiple claims from the same project.
- Similarly, for most hypercerts, the `impact_scope` will be most clearly represented as "all" (with an indefinite upper bound on the `impact_timeframe` dimensions). This gives the hypercert creator and its owners the flexibility to make claims about impact that may not have been observable or well-understood when the hypercert was created.

- It is recommended to browse the `impact_scope` and `work_scope` tags that have already been created and are in use by other projects. There is a catalog available at [hypercerts.xyz](https://hypercerts.xyz). Picking established tags can make it easier for users to discover, curate, and interact with your hypercert. In the long-run, we expect different ontologies to emerge in domains like climate solutions, open source software, etc, and picking more established tags  will help prevent overlapping or duplicate claims.
- Remember to specify any scopes that are explicitly excluded from the hypercert claim by using the `¬` prefix in the tag. Excluded scopes will not be displayed on the artwork.
- Order matters for display purposes. The hypercert artwork will only display a limited number of tags in the `impact_scope` array and `work_scope` arrays. The hypercert will only display the first two items in the `contributors` array and a count of the remaining contributors.
- A `contributor` can be identified using any human-readable string. The base case is to set the `contributors` to the wallet address used to create the hypercert. A multisig wallet can be used to represent a group of contributors.


### Assigning `rights` in the alpha version

In version 1.0 of the protocol, only two rights will be enabled:

- *Public Display*, giving owners of the hypercert the right to publicly display and receive social utility from their hypercert.
- *¬Transfers*, explicitly restricting anyone other apart from the creator of the hypercert from making transfers to other wallet addresses.

Additional `rights` including the potential for certain types of transfers to be explicitly enabled will be released in subsequent versions.

## Optional hidden properties

Creators may wish to add other fields in their metadata that are not a part of the hypercert claim and are not for display on third-party marketplaces like OpenSea. These can be added by creating a `hidden_properties` field in the metadata.

