import { BigNumber } from "ethers";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { mintInteractionLabels } from "../content/chainInteractions";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { CONTRACT_ADDRESS } from "../constants";
import { useEffect, useState } from "react";
import { useContractModal } from "../components/contract-interaction-dialog-context";
import { HyperCertMinterFactory } from "@network-goods/hypercerts-protocol";
import { verifyFractionClaim } from "../lib/verify-fraction-claim";
import { useToast } from "./toast";

export const useBatchMintHyperCertificateAllowlistEntry = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const { setStep, showModal } = useContractModal();
  const { address } = useAccount();

  const parseBlockchainError = useParseBlockchainError();
  const toast = useToast();

  const [_claimIds, setClaimIds] = useState<BigNumber[]>();
  const [_units, setUnits] = useState<BigNumber[]>();
  const [_proofs, setProofs] = useState<`0x{string}`[][]>();

  const stepDescriptions = {
    initial: "Initializing interaction",
    proofs: "Determining proofs",
    writing: "Minting fraction",
    complete: "Done minting",
  };

  const write = async (claimIds: string[]) => {
    showModal({ stepDescriptions });
    setStep("initial");
    if (!address) {
      throw new Error("No address found for current user");
    }
    setStep("proofs");

    const results = await Promise.all(
      claimIds.map((claimId) => verifyFractionClaim(claimId, address))
    );

    setClaimIds(results.map((x) => BigNumber.from(x.claimIDContract)));
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
    args: [_proofs!, _claimIds!, _units!],
    abi: HyperCertMinterFactory.abi,
    functionName: "batchMintClaimsFromAllowlists",
    onError: (error) => {
      parseError(error, "the fallback");
      toast({
        description: parseBlockchainError(
          error,

          mintInteractionLabels.toastError
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
      _proofs !== undefined && _claimIds !== undefined && _units !== undefined,
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
