import { BigNumber, BigNumberish } from "ethers";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { mintInteractionLabels } from "../content/chainInteractions";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
// import { HyperCertMinterFactory } from "@network-goods/hypercerts-sdk";
import { useEffect, useState } from "react";
import { useContractModal } from "../components/contract-interaction-dialog-context";
import { HyperCertMinterFactory } from "@network-goods/hypercerts-protocol";
import { useToast } from "./toast";
import { CONTRACT_ADDRESS } from "../lib/config";

export const useMintFractionAllowlist = ({
  onComplete,
  enabled,
}: {
  onComplete?: () => void;
  enabled: boolean;
}) => {
  const { setStep, showModal } = useContractModal();

  const parseBlockchainError = useParseBlockchainError();
  const toast = useToast();

  const [_claimId, setClaimId] = useState<BigNumber>();
  const [_units, setUnits] = useState<BigNumber>();
  const [_proof, setProof] = useState<`0x{string}`[]>();

  const stepDescriptions = {
    initial: "Initializing interaction",
    writing: "Minting fraction",
    complete: "Done minting",
  };

  const write = (
    proof: string[],
    claimId: BigNumberish,
    units: BigNumberish,
  ) => {
    setClaimId(BigNumber.from(claimId));
    setUnits(BigNumber.from(units));
    setProof(proof as `0x{string}`[]);
    setStep("initial");
    showModal({ stepDescriptions });
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
    args: [_proof!, _claimId!, _units!],
    abi: HyperCertMinterFactory.abi,
    functionName: "mintClaimFromAllowlist",
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
      enabled &&
      _proof !== undefined &&
      _claimId !== undefined &&
      _units !== undefined,
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
