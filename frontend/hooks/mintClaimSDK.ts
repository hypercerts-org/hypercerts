import { useContractModal } from "../components/contract-interaction-dialog-context";
import { mintInteractionLabels } from "../content/chainInteractions";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import {
  HypercertMetadata,
  TransferRestrictions,
} from "@hypercerts-org/hypercerts-sdk";
import { toast } from "react-toastify";
import { useHypercertClient } from "./hypercerts-client";

export const useMintClaimSDK = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const { client, isLoading } = useHypercertClient();

  const stepDescriptions = {
    preparing: "Preparing to mint hypercert",
    minting: "Minting hypercert on-chain",
    waiting: "Awaiting confirmation",
    complete: "Done minting",
  };

  const { setStep, showModal } = useContractModal();
  const parseError = useParseBlockchainError();

  const initializeWrite = async (
    metaData: HypercertMetadata,
    units: number,
  ) => {
    setStep("minting");
    try {
      const tx = await client.mintClaim(
        metaData,
        units,
        TransferRestrictions.FromCreatorOnly,
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
    }
  };

  return {
    write: async (metaData: HypercertMetadata, units: number) => {
      showModal({ stepDescriptions });
      setStep("preparing");
      await initializeWrite(metaData, units);
    },
    readOnly: isLoading || !client || client.readonly,
  };
};
