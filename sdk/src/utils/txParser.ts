import { Hash, PublicClient, decodeEventLog } from "viem";
import { HypercertMinterAbi } from "@hypercerts-org/contracts";

export type ClaimStoredEvent = {
  claimId: bigint;
  uri: string;
  totalUnits: bigint;
};

export type ParserReturnType = {
  success: boolean;
  data?: ClaimStoredEvent;
  errors?: Record<string, string | string[]>;
};

/**
 *
 * Utility method to parse a hypercert mint transaction (createAllowlist, mintClaim) and get the ID of the minted claim
 *
 * @notice This method is a wrapper around basic viem utilties to parse  ClaimStored(uint256 indexed claimID, string uri, uint256 totalUnits).
 *
 * @param client public client provided by viem
 * @param hash transaction hash returned from the transaction
 * @returns {Promise<ParserReturnType>} returns a promise with the parsed data or errors
 */
export const getClaimStoredDataFromTxHash = async (client: PublicClient, hash: Hash): Promise<ParserReturnType> => {
  const receipt = await client.getTransactionReceipt({
    hash,
  });

  const events = receipt.logs.map((log) =>
    decodeEventLog({
      abi: HypercertMinterAbi,
      data: log.data,
      topics: log.topics,
    }),
  );

  if (!events) {
    return {
      errors: {
        noEvents: "No events found for this transaction",
      },
      success: false,
    };
  }

  const claimEvent = events.find((e) => e.eventName === "ClaimStored");

  if (!claimEvent) {
    return {
      errors: {
        noClaimStoredEvent: "No ClaimStored event found",
      },
      success: false,
    };
  }

  if (isClaimStoredLog(claimEvent.args)) {
    return {
      data: claimEvent.args,
      success: true,
    };
  } else {
    return {
      errors: {
        couldNotParseLog: "Log arguments could not be mapped to ClaimStoredEvent",
        dataToParse: JSON.stringify(claimEvent.args),
      },
      success: false,
    };
  }
};

const isClaimStoredLog = (args: unknown): args is ClaimStoredEvent => {
  return (
    typeof args === "object" &&
    args !== null &&
    "claimId" in args &&
    typeof args.claimId === "bigint" &&
    "uri" in args &&
    typeof args.uri === "string" &&
    "totalUnits" in args &&
    typeof args.totalUnits === "bigint"
  );
};
