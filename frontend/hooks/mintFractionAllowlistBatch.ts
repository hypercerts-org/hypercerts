import { BigNumber } from "ethers";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { mintInteractionLabels } from "../content/chainInteractions";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useEffect, useState } from "react";
import { useContractModal } from "../components/contract-interaction-dialog-context";
import { HyperCertMinterFactory } from "@network-goods/hypercerts-protocol";
import { verifyFractionClaim } from "../lib/verify-fraction-claim";
import { useToast } from "./toast";
import { CONTRACT_ADDRESS } from "../lib/config";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase-client";

export const useMintFractionAllowlistBatch = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const { setStep, showModal, hideModal } = useContractModal();
  const { address } = useAccount();

  const { data: claimIds } = useGetAllEligibility(address || "");
  const parseBlockchainError = useParseBlockchainError();
  const toast = useToast();

  const [_units, setUnits] = useState<BigNumber[]>();
  const [_proofs, setProofs] = useState<`0x{string}`[][]>();

  const stepDescriptions = {
    initial: "Initializing interaction",
    proofs: "Determining proofs",
    writing: "Minting fraction",
    complete: "Done minting",
  };

  const write = async () => {
    showModal({ stepDescriptions });
    setStep("initial");

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

    setUnits(results.map((x) => BigNumber.from(x.units)));
    setProofs(results.map((x) => x.proof as `0x{string}`[]));
  };

  const parseError = useParseBlockchainError();
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    isLoading: isLoadingPrepareContractWrite,
    isSuccess: isReadyToWrite,
  } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    args: [
      _proofs!,
      (claimIds || []).map((x) => BigNumber.from(x.split("-")[1])),
      _units!,
    ],
    abi: HyperCertMinterFactory.abi,
    functionName: "batchMintClaimsFromAllowlists",
    onError: (error) => {
      parseError(error, "the fallback");
      toast({
        description: parseBlockchainError(
          error,

          mintInteractionLabels.toastError,
        ),
        status: "error",
      });
      console.error(error);
    },
    onSuccess: () => {
      toast({
        description: mintInteractionLabels.toastSuccess("Success"),
        status: "success",
      });
      setStep("writing");
    },
    enabled:
      _proofs !== undefined && _units !== undefined && !!claimIds?.length,
  });

  const {
    data,
    error: writeError,
    isError: isWriteError,
    isLoading: isLoadingContractWrite,
    writeAsync,
  } = useContractWrite(config);

  const {
    isLoading: isLoadingWaitForTransaction,
    isError: isWaitError,
    error: waitError,
  } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      // TODO: Remove key value pairs from sheet.best
      toast({
        description: mintInteractionLabels.toastSuccess("Success"),
        status: "success",
      });
      setStep("complete");
      onComplete?.();
    },
  });

  useEffect(() => {
    if (isReadyToWrite) {
      writeAsync?.();
    }
  }, [isReadyToWrite, writeAsync]);

  return {
    write,
    isLoading:
      isLoadingPrepareContractWrite ||
      isLoadingContractWrite ||
      isLoadingWaitForTransaction,
    isError: isPrepareError || isWriteError || isWaitError,
    error: prepareError || writeError || waitError,
  };
};

export const useGetAllEligibility = (address: string) => {
  return useQuery(["get-all-eligibility", address], async () => {
    return supabase
      .from("allowlistCache")
      .select("*")
      .eq("address", address)
      .then((res) => res.data?.map((x) => x.claimId as string) || []);
  });
};
