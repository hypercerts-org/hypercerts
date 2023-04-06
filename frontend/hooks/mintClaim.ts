import { useContractModal } from "../components/contract-interaction-dialog-context";
import { mintInteractionLabels } from "../content/chainInteractions";
import { CONTRACT_ADDRESS } from "../lib/config";
import { cidToIpfsUri } from "../lib/formatting";
import { hypercertsStorage } from "../lib/hypercerts-storage";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { HexString } from "../types/web3";
import { useAccountLowerCase } from "./account";
import { HyperCertMinterFactory } from "@hypercerts-org/hypercerts-protocol";
import {
  HypercertMetadata,
  HypercertMinting,
} from "@hypercerts-org/hypercerts-sdk";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export const useMintClaim = ({ onComplete }: { onComplete?: () => void }) => {
  const [cidUri, setCidUri] = useState<string>();
  const [units, setUnits] = useState<number>();
  const minter = HypercertMinting({ provider: undefined, chainConfig: {} });

  const stepDescriptions = {
    uploading: "Uploading metadata to ipfs",
    writing: "Minting hypercert on-chain",
    complete: "Done minting",
  };

  const { address } = useAccountLowerCase();
  const { setStep, showModal } = useContractModal();
  const parseBlockchainError = useParseBlockchainError();

  const initializeWrite = async (
    metaData: HypercertMetadata,
    units: number,
  ) => {
    setUnits(units);
    setStep("uploading");
    const cid = await hypercertsStorage.storeMetadata(metaData);
    setCidUri(cidToIpfsUri(cid));
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
    args: [
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      address! as HexString,
      BigNumber.from(units || 0),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      cidUri!,
      minter.transferRestrictions.FromCreatorOnly,
    ],
    abi: HyperCertMinterFactory.abi,
    functionName: "mintClaim",
    onError: error => {
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
  }, [isReadyToWrite]);

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
