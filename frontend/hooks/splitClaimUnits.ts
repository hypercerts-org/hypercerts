import { useContractModal } from "../components/contract-interaction-dialog-context";
import { mintInteractionLabels } from "../content/chainInteractions";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { toast } from "react-toastify";
import { useHypercertClient } from "./hypercerts-client";
import { BigNumberish } from "ethers";
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

  const initializeWrite = async (
    id: BigNumberish,
    fractions: BigNumberish[],
  ) => {
    setStep("splitting");
    try {
      setTxPending(true);

      const tx = await client.splitClaimUnits(id, fractions);
      setStep("waiting");

      const receipt = await tx.wait(5);
      if (receipt.status === 0) {
        toast("Splitting failed", {
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
    } finally {
      hideModal();
      setTxPending(false);
    }
  };

  return {
    write: async (id: BigNumberish, fractions: BigNumberish[]) => {
      showModal({ stepDescriptions });
      setStep("preparing");
      await initializeWrite(id, fractions);
    },
    txPending,
    readOnly: isLoading || !client || client.readonly,
  };
};
