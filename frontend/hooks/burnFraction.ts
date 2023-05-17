import { useContractModal } from "../components/contract-interaction-dialog-context";
import { burnInteractionLabels } from "../content/chainInteractions";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { toast } from "react-toastify";
import { useHypercertClient } from "./hypercerts-client";
import { BigNumberish } from "ethers";

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
    complete: "Done minting",
  };

  const { setStep, showModal } = useContractModal();
  const parseError = useParseBlockchainError();

  const initializeBurn = async (claimId: BigNumberish) => {
    setStep("burning");
    try {
      const tx = await client.burnClaimFraction(claimId);
      setStep("waiting");

      const receipt = await tx.wait();
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
    }
  };

  return {
    write: async (claimId: BigNumberish) => {
      showModal({ stepDescriptions });
      setStep("preparing");
      await initializeBurn(claimId);
    },
    readOnly: isLoading || !client || client.readonly,
  };
};
