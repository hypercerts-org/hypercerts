import { DecodeEventLogReturnType, Hash, PublicClient, decodeEventLog } from "viem";
import { HypercertMinterAbi } from "@hypercerts-org/contracts";
import { z } from "zod";

const ClaimStoredLog = z.object({
  claimId: z.bigint(),
  uri: z.string(),
  totalUnits: z.bigint(),
});

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

  const claimEvent = receipt.logs
    .map((log): DecodeEventLogReturnType | null => {
      const decodedLog = decodeEventLog({
        abi: HypercertMinterAbi,
        data: log.data,
        topics: log?.topics,
      });
      // Ensure that the decoded log matches the EventLog interface
      // TODO fix hacky typing
      if (decodedLog) {
        return decodedLog as unknown as DecodeEventLogReturnType;
      }
      return null;
    })
    .find((e): e is DecodeEventLogReturnType => e !== null && e.eventName === "ClaimStored");

  if (!claimEvent) {
    return {
      errors: {
        noEvents: "No ClaimStored event found for this transaction",
      },
      success: false,
    };
  }

  try {
    const parsedData = ClaimStoredLog.parse(claimEvent.args);

    return {
      data: parsedData,
      success: true,
    };
  } catch (e: unknown) {
    console.error(e);
    if (typeof e === "string") {
      return {
        errors: {
          error: e,
          couldNotParseLog: "Log arguments could not be mapped to ClaimStoredEvent",
          dataToParse: JSON.stringify(claimEvent.args),
        },
        success: false,
      };
    } else if (e instanceof Error) {
      return {
        errors: {
          error: e.message,
          couldNotParseLog: "Log arguments could not be mapped to ClaimStoredEvent",
          dataToParse: JSON.stringify(claimEvent.args),
        },
        success: false,
      };
    } else {
      return {
        errors: {
          error: "Unknown error, check logs for more information",
          couldNotParseLog: "Log arguments could not be mapped to ClaimStoredEvent",
          dataToParse: JSON.stringify(claimEvent.args),
        },
        success: false,
      };
    }
  }
};
