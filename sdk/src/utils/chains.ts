import { parseClaimOrFractionId } from "./parsing";

export const isClaimOnChain = (claimId: string, chainId: number | undefined) => {
  if (chainId === undefined) {
    return false;
  }
  const { chainId: parsedChainId } = parseClaimOrFractionId(claimId);
  return parsedChainId === chainId;
};
