import { useContractModal } from "../components/contract-interaction-dialog-context";
import { mintInteractionLabels } from "../content/chainInteractions";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { HypercertMetadata, TransferRestrictions } from "@hypercerts-org/sdk";
import { toast } from "react-toastify";
import { useHypercertClient } from "./hypercerts-client";
import { useState } from "react";

export const useMintClaim = ({ onComplete }: { onComplete?: () => void }) => {
  const [txPending, setTxPending] = useState(false);

  const { client, isLoading } = useHypercertClient();

  const stepDescriptions = {
    preparing: "Preparing to mint hypercert",
    minting: "Minting hypercert on-chain",
    waiting: "Awaiting confirmation",
    complete: "Done minting",
  };

  const { setStep, showModal, hideModal } = useContractModal();
  const parseError = useParseBlockchainError();

  const initializeWrite = async (
    metaData: HypercertMetadata,
    units: number,
    transferRestrictions: TransferRestrictions,
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

      const hash = await client.mintClaim(
        metaData,
        BigInt(units),
        transferRestrictions,
      );

      if (!hash) {
        toast("No tx hash returned", {
          type: "error",
        });
        return;
      }

      const receipt =
        await client.config.publicClient?.waitForTransactionReceipt({
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
    write: async (
      metaData: HypercertMetadata,
      units: number,
      transferRestrictions: TransferRestrictions = TransferRestrictions.FromCreatorOnly,
    ) => {
      showModal({ stepDescriptions });
      setStep("preparing");
      await initializeWrite(metaData, units, transferRestrictions);
    },
    txPending,
    readOnly: isLoading || !client || client.readonly,
  };
};
