import { useNetwork } from "wagmi";
import { useContractModal } from "../components/contract-interaction-dialog-context";
import { mintInteractionLabels } from "../content/chainInteractions";
import { SUPABASE_TABLE } from "../lib/config";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { supabase } from "../lib/supabase-client";
import { HexString } from "../types/web3";
import { useAccountLowerCase } from "./account";
import { useHypercertClient } from "./hypercerts-client";
import { ClaimProof, useVerifyFractionClaim } from "./verifyFractionClaim";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useState } from "react";
import { toast } from "react-toastify";

export const useMintFractionAllowlistBatch = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const [txPending, setTxPending] = useState(false);
  const { setStep, showModal, hideModal } = useContractModal();
  const { address } = useAccountLowerCase();
  const { verifyFractionClaim } = useVerifyFractionClaim();
  const { client, isLoading } = useHypercertClient();
  const { chain } = useNetwork();
  const { data: claimIds } = useGetAllEligibility(address ?? "", chain?.id);
  const parseError = useParseBlockchainError();

  const stepDescriptions = {
    initial: "Initializing interaction",
    proofs: "Getting and verifying proofs",
    minting: "Minting fraction",
    waiting: "Awaiting confirmation",
    complete: "Done minting",
  };

  const initializeWrite = async () => {
    if (!client) {
      throw new Error("No client found");
    }
    if (!address) {
      throw new Error("No address found for current user");
    }
    if (!claimIds) {
      throw new Error("No claim ids found for the current user");
    }

    setStep("proofs");

    if (!claimIds.length) {
      hideModal();
    }

    const results = await Promise.all(
      claimIds.map((claimId) => verifyFractionClaim(claimId, address)),
    );

    const verified: ClaimProof[] = results.flat().filter((x) => x);
    const unique = _.uniqWith(verified, _.isEqual);

    const claimIDs = unique.map((claimProof) =>
      BigInt(claimProof.claimIDContract),
    );
    const units = unique.map((claimProof) => BigInt(claimProof.units));
    const proofs = unique.map((claimProof) => claimProof.proof as HexString[]);

    console.log("Unique Verified proofs", unique);
    console.log("Ids", claimIDs);
    console.log("Units", units);
    console.log("Proofs", proofs);

    setStep("minting");
    try {
      setTxPending(true);

      const hash = await client.batchMintClaimFractionsFromAllowlists(
        claimIDs,
        units,
        proofs,
      );

      const publicClient = client.config.publicClient;
      const receipt = await publicClient?.waitForTransactionReceipt({
        confirmations: 3,
        hash: hash,
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
      setTxPending(false);
    }
  };
  return {
    write: async () => {
      showModal({ stepDescriptions });
      setStep("initial");
      await initializeWrite();
    },
    txPending,
    readOnly: isLoading || !client || client.readonly,
  };
};

export const useGetAllEligibility = (address: string, chainId?: number) => {
  return useQuery(
    ["get-all-eligibility", address],
    async () => {
      const { data, error } = await supabase
        .from(SUPABASE_TABLE)
        .select("*")
        .eq("chainId", chainId)
        .eq("address", address.toLowerCase())
        .eq("hidden", false);
      if (error) {
        console.error("Supabase error:");
        console.error(error);
      }
      const claimIds = data?.map((x) => x.claimId as string);
      return claimIds ?? [];
    },
    { enabled: !!address && !!chainId, refetchInterval: 5000 },
  );
};
