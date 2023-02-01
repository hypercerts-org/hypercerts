
---
title: Metadata
id: metadata
sidebar_position: 9
---

# Hypercert Metadata Structure

Hypercerts are represented as [ERC-1155](https://eips.ethereum.org/EIPS/eip-1155) tokens. All token instances of a hypercert must share the same ERC-1155 metadata. For sites like OpenSea to pull in off-chain metadata for ERC-1155 assets, your hypercert contract will need to return an IPFS URI that contains all necessary hypercert metadata.

The hypercert metadata schema follows the [Enjin recommendation](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1155.md#erc-1155-metadata-uri-json-schema) for ERC-1155 metadata. It also includes **six required dimensions** that are necessary to establish the hypercert's claim on the overall impact space.

The following are standard ERC-1155 metadata fields.
