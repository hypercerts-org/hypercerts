import { errorMessages } from "../content/readable-errors";
import { decodeErrorResult } from "viem";
import { HypercertMinterAbi } from "@hypercerts-org/contracts";

export const useParseBlockchainError = () => {
  return (e: any, fallbackMessage: string) => {
    const unparsedErrorData = e?.error?.data?.originalError?.data;

    if (unparsedErrorData) {
      const errorData = decodeErrorResult({
        abi: HypercertMinterAbi,
        data: unparsedErrorData,
      });

      if (errorData) {
        console.log("Blockchain error", errorData);
        const errorName = errorData.errorName;
        return errorMessages[errorName] || errorName;
      }
    }

    console.log("Trouble parsing error", { ...e });

    return (
      e?.reason?.replace("execution reverted: ", "") ||
      e?.error?.data?.data?.message ||
      e?.error?.data?.message ||
      e?.message ||
      fallbackMessage
    );
  };
};
