import { useContractModal } from "../components/contract-interaction-dialog-context";
import { burnInteractionLabels } from "../content/chainInteractions";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { toast } from "react-toastify";
import { useHypercertClient } from "./hypercerts-client";

export const useBurnFraction = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
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
      const tx = await client.burnClaimFraction(claimId);
      setStep("burning");

      const receipt = await tx.wait();
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
    }
  };

  return {
    write: async (claimId: bigint) => {
      showModal({ stepDescriptions });
      await initializeBurn(claimId);
    },
    readOnly: isLoading || !client || client.readonly,
  };
};
