import { useContractModal } from "../components/contract-interaction-dialog-context";
import { mintInteractionLabels } from "../content/chainInteractions";
import { CONTRACT_ADDRESS } from "../lib/config";
import { SUPABASE_TABLE } from "../lib/config";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { supabase } from "../lib/supabase-client";
import { ClaimProof, verifyFractionClaim } from "../lib/verify-fraction-claim";
import { HexString } from "../types/web3";
import { useAccountLowerCase } from "./account";
import { HyperCertMinterFactory } from "@hypercerts-org/contracts";
import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export const useMintFractionAllowlistBatch = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const { setStep, showModal, hideModal } = useContractModal();
  const { address } = useAccountLowerCase();

  const { data: claimIds } = useGetAllEligibility(address ?? "");
  const parseBlockchainError = useParseBlockchainError();

  const [_units, setUnits] = useState<BigNumber[]>();
  const [_proofs, setProofs] = useState<HexString[][]>();

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

    const verified = results.filter((x) => x) as ClaimProof[];

    setUnits(verified.map((x) => BigNumber.from(x.units)));
    setProofs(verified.map((x) => x.proof as HexString[]));
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      address! as HexString,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      _proofs!,
      (claimIds || []).map((x) => BigNumber.from(x.split("-")[1])),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      _units!,
    ],
    abi: HyperCertMinterFactory.abi,
    functionName: "batchMintClaimsFromAllowlists",
    onError: (error) => {
      parseError(error, "the fallback");
      toast(
        parseBlockchainError(
          error,

          mintInteractionLabels.toastError,
        ),
        {
          type: "error",
        },
      );
      console.error(error);
    },
    onSuccess: () => {
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
    write: writeSync,
  } = useContractWrite(config);

  const {
    isLoading: isLoadingWaitForTransaction,
    isError: isWaitError,
    error: waitError,
  } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      // TODO: Remove key value pairs from sheet.best
      toast(mintInteractionLabels.toastBatchSuccess, { type: "success" });
      setStep("complete");
      onComplete?.();
    },
  });

  useEffect(() => {
    if (isReadyToWrite) {
      writeSync?.();
    }
  }, [isReadyToWrite]);

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
