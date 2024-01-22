import { HypercertMetadata } from "../generated/schema";
import { Bytes, dataSource, json, log } from "@graphprotocol/graph-ts";

// type HypercertMetaData @entity {
//   id: String!
//   name: String
//   description: String
//   image: String
//   external_url: String
//   version: String
//   ref: String
//   properties: [Attribute!]!
//   claimData: [ClaimData!]!
//   allowlist: Allowlist
// }

// type ClaimData @entity {
//   id: String!
//   impactScope: [String!]!
//   workScope: [String!]!
//   workTimeframe: [BigInt!]!
//   impactTimeframe: [BigInt!]!
//   contributors: [String!]!
//   rights: [String!]!
// }

// type Attribute @entity {
//   id: String!
//   traitType: String!
//   value: String!
// }
export function handleHypercertMetadata(content: Bytes): void {
  const hcMetadata = new HypercertMetadata(dataSource.stringParam());
  const value = json.fromBytes(content).toObject();

  log.debug("Handle Hypercert Metadata: {}", [content.toString()]);

  if (value) {
    hcMetadata.id = dataSource.stringParam();
    const name = value.get("name");
    const description = value.get("description");
    const image = value.get("image");
    const external_url = value.get("external_url");
    const version = value.get("version");
    const ref = value.get("ref");
    // const properties = value.get("properties");
    // const claimData = value.get("claimData");

    if (name) {
      hcMetadata.name = name.toString();
    }

    if (description) {
      hcMetadata.description = description.toString();
    }

    if (image) {
      hcMetadata.image = image.toString();
    }

    if (external_url) {
      hcMetadata.external_url = external_url.toString();
    }

    if (version) {
      hcMetadata.version = version.toString();
    }

    if (ref) {
      hcMetadata.ref = ref.toString();
    }

    // if (properties) {
    //   hcMetadata.properties = properties.toString();
    // }

    // if (claimData) {
    //   hcMetadata.claimData = claimData.toString();
    // }
  }

  hcMetadata.save();
}
