import { isAddress } from "viem";

export const parseClaimOrFractionId = (claimId: string) => {
  const [chainId, contractAddress, id] = claimId.split("-");

  if (!chainId || !contractAddress || !id || !isAddress(contractAddress)) {
    console.log(`Invalid claimId format (claimId given: ${claimId}}. Expected "chainId-contractAddress-tokenId`);
    throw new Error(`Invalid claimId format (claimId given: ${claimId}}. Expected "chainId-contractAddress-tokenId"`);
  }

  let chainIdParsed: number | undefined;
  try {
    chainIdParsed = parseInt(chainId, 10);
  } catch (error) {
    console.log(`Invalid chainId while parsing: ${chainId}`);
    throw new Error(`Invalid chainId while parsing: ${chainId}`);
  }

  let idParsed: bigint | undefined;
  try {
    idParsed = BigInt(id);
  } catch (error) {
    console.log(`Invalid id while parsing: ${id}`);
    throw new Error(`Invalid id while parsing: ${id}`);
  }

  if (!chainIdParsed || !idParsed) {
    console.log(`Invalid claimId format (claimId given: ${claimId}}. Expected "chainId-contractAddress-tokenId"`);
    throw new Error(`Invalid claimId format (claimId given: ${claimId}}. Expected "chainId-contractAddress-tokenId"`);
  }

  return {
    chainId: chainIdParsed,
    contractAddress,
    id: idParsed,
  };
};
