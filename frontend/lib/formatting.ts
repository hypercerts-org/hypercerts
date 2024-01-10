import _ from "lodash";

export const formatScope = (scopeLabel: string) =>
  scopeLabel.toLowerCase().replaceAll(/\s+/g, "-").trim();

export const formatContributors = (contributors: string[]) => {
  if (contributors.length === 0) {
    return "";
  }

  if (contributors.length === 1) {
    return contributors[0];
  }

  const initial = _.initial(contributors);
  const last = _.last(contributors);

  return `${initial.join(", ")} & ${last}`;
};

export const formatFractionPercentage = (
  fractionUnits: string,
  totalUnits: string,
) => {
  const totalUnitsParsed = parseInt(totalUnits, 10);
  if (totalUnitsParsed === 0) {
    return "0%";
  }

  const fractionUnitsParsed = parseInt(fractionUnits, 10);

  const fraction = fractionUnitsParsed / totalUnitsParsed;
  const percentage = fraction * 100;

  return `${percentage.toFixed(2)}%`;
};

export const formatTime = (startTime: number, endTime?: number) => {
  if (startTime === endTime) {
    return new Date(startTime * 1000).toDateString();
  }

  if (endTime === undefined) {
    return `from ${new Date(startTime * 1000)}`;
  }

  return `${new Date(startTime * 1000).toDateString()} until ${new Date(
    endTime * 1000,
  ).toDateString()}`;
};

export const getOpenSeaFractionUrl = (
  tokenId: string,
  contractAddress: string,
) => {
  let _tokenId = BigInt(tokenId).toString();
  // n is appended to BigInt as a string to indicate that it is a BigInt
  if (_tokenId.endsWith("n")) {
    _tokenId = _tokenId.slice(0, -1);
  }

  return `https://testnets.opensea.io/assets/sepolia/${contractAddress}/${_tokenId}`;
};

export const formatAddress = (address: string) =>
  `${address.slice(0, 4)}...${address.slice(-4)}`;

/**
 * Prefix cid with `ipfs://` if it's not already
 * @param cid
 * @returns
 */
export const cidToIpfsUri = (cid: string) =>
  cid.startsWith("ipfs://") ? cid : `ipfs://${cid}`;

const getIpfsGatewayUri = (cidOrIpfsUri: string) => {
  const NFT_STORAGE_IPFS_GATEWAY = "https://nftstorage.link/ipfs/{cid}";
  const cid = cidOrIpfsUri.replace("ipfs://", "");
  return NFT_STORAGE_IPFS_GATEWAY.replace("{cid}", cid);
};

export const formatExternalUrl = (externalUrl?: string) => {
  if (!externalUrl) {
    return "";
  }
  if (!externalUrl.startsWith("ipfs://")) {
    return externalUrl;
  }

  return getIpfsGatewayUri(externalUrl);
};
