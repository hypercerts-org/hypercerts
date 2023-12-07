import { useContractModal } from "../components/contract-interaction-dialog-context";
import { burnInteractionLabels } from "../content/chainInteractions";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { toast } from "react-toastify";
import { useHypercertClient } from "./hypercerts-client";
import { useState } from "react";

export const useBurnFraction = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const [txPending, setTxPending] = useState(false);

  const { client, isLoading } = useHypercertClient();

  const stepDescriptions = {
    preparing: "Preparing to burn fraction",
    burning: "Burning hypercert fraction",
    waiting: "Awaiting confirmation",
    complete: "Done burning",
  };

  const { setStep, showModal, hideModal } = useContractModal();
  const parseError = useParseBlockchainError();

  const initializeBurn = async (claimId: bigint) => {
    setStep("preparing");
    try {
      setTxPending(true);

      setStep("burning");

      if (!client) {
        toast("No client found", {
          type: "error",
        });
        return;
      }

      const hash = await client.burnClaimFraction(claimId);

      const publicClient = client.config.publicClient;
      const receipt = await publicClient?.waitForTransactionReceipt({
        confirmations: 3,
        hash: hash,
      });

      setStep("waiting");

      if (receipt?.status === "reverted") {
        toast("Burning failed", {
          type: "error",
        });
        console.error(receipt);
      }
      if (receipt?.status === "success") {
        toast(burnInteractionLabels.toastSuccess(receipt.transactionHash), {
          type: "success",
        });

        setStep("complete");
        onComplete?.();
      }
    } catch (error) {
      toast(parseError(error, burnInteractionLabels.toastError), {
        type: "error",
      });
      console.error(error);
    } finally {
      hideModal();
      setTxPending(false);
    }
  };

  return {
    write: async (claimId: bigint) => {
      showModal({ stepDescriptions });
      await initializeBurn(claimId);
    },
    txPending,
    readOnly: isLoading || !client || client.readonly,
  };
};
