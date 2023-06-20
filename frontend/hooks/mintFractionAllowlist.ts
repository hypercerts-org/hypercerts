import { useContractModal } from "../components/contract-interaction-dialog-context";
import { mintInteractionLabels } from "../content/chainInteractions";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { BigNumberish } from "ethers";
import { toast } from "react-toastify";
import { useHypercertClient } from "./hypercerts-client";
import { useState } from "react";

export const useMintFractionAllowlist = ({
  onComplete,
  enabled,
}: {
  onComplete?: () => void;
  enabled: boolean;
}) => {
  const [txPending, setTxPending] = useState(false);

  const { client, isLoading } = useHypercertClient();
  const { setStep, showModal, hideModal } = useContractModal();

  const stepDescriptions = {
    initial: "Initializing interaction",
    minting: "Minting fraction",
    waiting: "Awaiting confirmation",
    complete: "Done minting",
  };

  const parseError = useParseBlockchainError();

  const initializeWrite = async (
    claimID: BigNumberish,
    units: BigNumberish,
    proof: string[],
  ) => {
    setStep("minting");
    try {
      setTxPending(true);

      const tx = await client.mintClaimFractionFromAllowlist(
        claimID,
        units,
        proof,
      );
      setStep("waiting");

      const receipt = await tx.wait();
      if (receipt.status === 0) {
        toast("Minting failed", {
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
    write: async (
      proof: string[],
      claimId: BigNumberish,
      units: BigNumberish,
    ) => {
      showModal({ stepDescriptions });
      setStep("initial");
      await initializeWrite(claimId, units, proof);
    },
    readOnly: !enabled || isLoading || !client || client.readonly,
  };
};
