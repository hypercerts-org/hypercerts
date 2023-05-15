import { useContractModal } from "../components/contract-interaction-dialog-context";
import { mintInteractionLabels } from "../content/chainInteractions";
import { SUPABASE_TABLE } from "../lib/config";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { supabase } from "../lib/supabase-client";
import { verifyFractionClaim } from "../lib/verify-fraction-claim";
import { useAccountLowerCase } from "./account";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useHypercertClient } from "./hypercerts-client";
import { ClaimProof } from "@hypercerts-org/hypercerts-sdk";

export const useMintFractionAllowlistBatchSDK = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const { client, isLoading } = useHypercertClient();
  const { setStep, showModal, hideModal } = useContractModal();
  const { address } = useAccountLowerCase();

  const { data: claimIds } = useGetAllEligibility(address ?? "");
  const parseError = useParseBlockchainError();

  const stepDescriptions = {
    initial: "Initializing interaction",
    proofs: "Determining proofs",
    writing: "Minting fraction",
    complete: "Done minting",
  };

  const initializeWrite = async () => {
    setStep("initial");

    try {
      setStep("proofs");
      if (!address) {
        throw new Error("No address found for current user");
      }
      if (!claimIds) {
        throw new Error("No claim ids found for the current user");
      }

      const results = await Promise.all(
        claimIds.map((claimId) => verifyFractionClaim(claimId, address)),
      );

      const verified = results.filter((x) => x) as ClaimProof[];

      const tx = await client.batchMintClaimFractionFromAllowlist(verified);
      setStep("writing");

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
    }
  };

  return {
    write: async () => {
      showModal({ stepDescriptions });
      await initializeWrite();
    },
    readOnly: isLoading || !client || client.readonly,
  };
};

export const useGetAllEligibility = (address: string) => {
  return useQuery(["get-all-eligibility", address], async () => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLE)
      .select("*")
      .eq("address", address.toLowerCase());
    if (error) {
      console.error("Supabase error:");
      console.error(error);
    }
    const claimIds = data?.map((x) => x.claimId as string);
    return claimIds ?? [];
  });
};
