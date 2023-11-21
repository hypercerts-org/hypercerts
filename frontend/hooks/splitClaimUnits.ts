import { useContractModal } from "../components/contract-interaction-dialog-context";
import { mintInteractionLabels } from "../content/chainInteractions";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { toast } from "react-toastify";
import { useHypercertClient } from "./hypercerts-client";
import { useState } from "react";

export const useSplitFractionUnits = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const [txPending, setTxPending] = useState(false);

  const { client, isLoading } = useHypercertClient();

  const stepDescriptions = {
    preparing: "Preparing to merge fraction values",
    merging: "Splitting fraction units on-chain",
    waiting: "Awaiting confirmation",
    complete: "Done splitting",
  };

  const { setStep, showModal, hideModal } = useContractModal();
  const parseError = useParseBlockchainError();

  const publicClient = client.config.publicClient;

  const initializeWrite = async (fractionId: bigint, fractions: bigint[]) => {
    setStep("splitting");
    try {
      setTxPending(true);

      const hash = await client.splitFractionUnits(fractionId, fractions);

      const receipt = await publicClient?.waitForTransactionReceipt({
        confirmations: 3,
        hash: hash,
      });

      setStep("waiting");

      if (receipt?.status === "reverted") {
        toast("Splitting failed", {
          type: "error",
        });
        console.error(receipt);
      }
      if (receipt?.status === "success") {
        toast(mintInteractionLabels.toastSuccess, { type: "success" });

        setStep("complete");
        onComplete?.();
      }
    } catch (error) {
      toast(parseError(error, mintInteractionLabels.toastError), {
        type: "error",
      });
      console.error(error);
    } finally {
      hideModal();
      setTxPending(false);
    }
  };

  return {
    write: async (id: bigint, fractions: bigint[]) => {
      showModal({ stepDescriptions });
      setStep("preparing");
      await initializeWrite(id, fractions);
    },
    txPending,
    readOnly: isLoading || !client || client.readonly,
  };
};
