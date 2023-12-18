import { useContractModal } from "../components/contract-interaction-dialog-context";
import { mintInteractionLabels } from "../content/chainInteractions";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
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
    claimID: bigint,
    units: bigint,
    proof: `0x${string}`[],
  ) => {
    setStep("minting");
    try {
      setTxPending(true);

      if (!client) {
        toast("No client found", {
          type: "error",
        });
        return;
      }

      const hash = await client.mintClaimFractionFromAllowlist(
        claimID,
        units,
        proof,
      );

      if (!hash) {
        toast("No tx hash returned", {
          type: "error",
        });
        return;
      }

      const publicClient = client.config.publicClient;
      const receipt = await publicClient?.waitForTransactionReceipt({
        confirmations: 3,
        hash,
      });

      setStep("waiting");

      if (receipt?.status === "reverted") {
        toast("Minting failed", {
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
    write: async (proof: `0x${string}`[], claimId: bigint, units: bigint) => {
      showModal({ stepDescriptions });
      setStep("initial");
      await initializeWrite(claimId, units, proof);
    },
    txPending,
    readOnly: !enabled || isLoading || !client || client.readonly,
  };
};
