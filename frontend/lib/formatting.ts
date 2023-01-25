import _ from "lodash";
import { BigNumber } from "ethers";

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
  totalUnits: string
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
    endTime * 1000
  ).toDateString()}`;
};

export const getOpenSeaFractionUrl = (tokenId: string, contractAddress: string) => {
  return `https://testnets.opensea.io/assets/goerli/${contractAddress}/${BigNumber.from(
    tokenId
  ).toNumber()}`;
};

export const formatAddress = (address: string) =>
  `${address.slice(0, 4)}...${address.slice(-4)}`;
