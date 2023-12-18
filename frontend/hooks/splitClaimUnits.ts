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
    splitting: "Splitting fraction units on-chain",
    waiting: "Awaiting confirmation",
    complete: "Done splitting",
  };

  const { setStep, showModal, hideModal } = useContractModal();
  const parseError = useParseBlockchainError();

  const initializeWrite = async (fractionId: bigint, fractions: bigint[]) => {
    if (!client) {
      toast("No client found", {
        type: "error",
      });
      return;
    }
    showModal({ stepDescriptions });
    setStep("splitting");
    try {
      setTxPending(true);

      const hash = await client.splitFractionUnits(fractionId, fractions);

      if (!hash) {
        toast("No tx hash returned", {
          type: "error",
        });
        return;
      }

      setStep("waiting");
      const publicClient = client.config.publicClient;
      const receipt = await publicClient?.waitForTransactionReceipt({
        confirmations: 3,
        hash,
      });

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
      await initializeWrite(id, fractions);
      window.location.reload();
    },
    txPending,
    readOnly: isLoading || !client || client.readonly,
  };
};
