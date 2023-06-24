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

      const tx = await client.burnClaimFraction(claimId);
      setStep("burning");

      const receipt = await tx.wait(5);
      setStep("waiting");

      if (receipt.status === 0) {
        toast("Minting failed", {
          type: "error",
        });
        console.error(receipt);
      }
      if (receipt.status === 1) {
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
