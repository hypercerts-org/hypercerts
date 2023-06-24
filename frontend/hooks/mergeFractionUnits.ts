import { useContractModal } from "../components/contract-interaction-dialog-context";
import { mintInteractionLabels } from "../content/chainInteractions";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { toast } from "react-toastify";
import { useHypercertClient } from "./hypercerts-client";

export const useMergeFractionUnits = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const { client, isLoading } = useHypercertClient();

  const stepDescriptions = {
    preparing: "Preparing to merge fraction values",
    merging: "Merging values on-chain",
    waiting: "Awaiting confirmation",
    complete: "Done merging",
  };

  const { setStep, showModal } = useContractModal();
  const parseError = useParseBlockchainError();

  const initializeWrite = async (ids: bigint[]) => {
    setStep("merging");
    try {
      const tx = await client.mergeClaimUnits(ids);
      setStep("waiting");

      const receipt = await tx.wait();
      if (receipt.status === 0) {
        toast("Merging failed", {
          type: "error",
        });
        console.error(receipt);
      }
      if (receipt.status === 1) {
        toast(mintInteractionLabels.toastSuccess, { type: "success" });

        setStep("complete");
        onComplete?.();
      }
    } catch (error) {
      toast(parseError(error, mintInteractionLabels.toastError), {
        type: "error",
      });
      console.error(error);
    }
  };

  return {
    write: async (ids: bigint[]) => {
      showModal({ stepDescriptions });
      setStep("preparing");
      await initializeWrite(ids);
    },
    readOnly: isLoading || !client || client.readonly,
  };
};
