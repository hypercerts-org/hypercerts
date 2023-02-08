import { useEffect, useState } from "react";
import {
  HypercertMetadata,
  storeMetadata,
} from "@network-goods/hypercerts-sdk";
import { useContractModal } from "../components/contract-interaction-dialog-context";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { CONTRACT_ADDRESS } from "../lib/config";
import { BigNumber } from "ethers";
import { mintInteractionLabels } from "../content/chainInteractions";
import { HyperCertMinterFactory } from "@network-goods/hypercerts-protocol";
import { toast } from "react-toastify";

export const useMintClaim = ({ onComplete }: { onComplete?: () => void }) => {
  const [cidUri, setCidUri] = useState<string>();
  const [units, setUnits] = useState<number>();

  const stepDescriptions = {
    uploading: "Uploading metadata to ipfs",
    writing: "Minting hypercert on-chain",
    complete: "Done minting",
  };

  const { setStep, showModal } = useContractModal();
  const parseBlockchainError = useParseBlockchainError();

  const initializeWrite = async (
    metaData: HypercertMetadata,
    units: number,
  ) => {
    setUnits(units);
    setStep("uploading");
    const cid = await storeMetadata(metaData);
    setCidUri(cid);
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
    args: [BigNumber.from(units || 0), cidUri!, 2],
    abi: HyperCertMinterFactory.abi,
    functionName: "mintClaim",
    onError: (error) => {
      parseError(error, "the fallback");
      toast(parseBlockchainError(error, mintInteractionLabels.toastError), {
        type: "error",
      });
      console.error(error);
    },
    onSuccess: () => {
      toast(mintInteractionLabels.toastSuccess, { type: "success" });
      setStep("writing");
    },
    enabled: !!cidUri && units !== undefined,
  });

  const {
    data,
    writeAsync,
    error: writeError,
    isError: isWriteError,
    isLoading: isLoadingContractWrite,
  } = useContractWrite(config);

  const {
    isLoading: isLoadingWaitForTransaction,
    isError: isWaitError,
    error: waitError,
  } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      toast(mintInteractionLabels.toastSuccess, { type: "success" });
      setStep("complete");
      onComplete?.();
    },
  });

  useEffect(() => {
    const perform = async () => {
      if (isReadyToWrite && writeAsync) {
        await writeAsync();
      }
    };
    perform();
  }, [isReadyToWrite, writeAsync]);

  return {
    write: async (metaData: HypercertMetadata, units: number) => {
      showModal({ stepDescriptions });
      setStep("preparing");
      await initializeWrite(metaData, units);
    },
    isLoading:
      isLoadingPrepareContractWrite ||
      isLoadingContractWrite ||
      isLoadingWaitForTransaction,
    isError: isPrepareError || isWriteError || isWaitError,
    error: prepareError || writeError || waitError,
    isReadyToWrite,
  };
};
