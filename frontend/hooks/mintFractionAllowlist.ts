import { useContractModal } from "../components/contract-interaction-dialog-context";
import { mintInteractionLabels } from "../content/chainInteractions";
import { CONTRACT_ADDRESS } from "../lib/config";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { useAccountLowerCase } from "./account";
import { HyperCertMinterFactory } from "@hypercerts-org/hypercerts-protocol";
import { BigNumber, BigNumberish } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export const useMintFractionAllowlist = ({
  onComplete,
  enabled,
}: {
  onComplete?: () => void;
  enabled: boolean;
}) => {
  const { setStep, showModal } = useContractModal();
  const { address } = useAccountLowerCase();

  const parseBlockchainError = useParseBlockchainError();

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
    args: [address! as `0x${string}`, _proof!, _claimId!, _units!],
    abi: HyperCertMinterFactory.abi,
    functionName: "mintClaimFromAllowlist",
    onError: (error) => {
      parseError(error, "the fallback");
      toast(parseBlockchainError(error, mintInteractionLabels.toastError), {
        type: "error",
      });
      console.error(error);
    },
    onSuccess: () => {
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
    write: writeSync,
  } = useContractWrite(config);

  const {
    isLoading: isLoadingWaitForTransaction,
    isError: isWaitError,
    error: waitError,
  } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      toast(mintInteractionLabels.toastFractionSuccess, { type: "success" });
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
