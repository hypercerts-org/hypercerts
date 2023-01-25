import { BigNumber } from "ethers";
import { useContractModal } from "../components/contract-interaction-dialog-context";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { CONTRACT_ADDRESS, SHEET_BEST_ENDPOINT } from "../constants";
import {
  HypercertMetadata,
  storeData,
  storeMetadata,
} from "@network-goods/hypercerts-sdk";
import { mintInteractionLabels } from "../content/chainInteractions";
import { useEffect, useState } from "react";
import _ from "lodash";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { HyperCertMinterFactory } from "@network-goods/hypercerts-protocol";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "./toast";

const generateAndStoreTree = async (
  pairs: { address: string; fraction: number }[]
) => {
  const tree = StandardMerkleTree.of(
    pairs.map((p) => [p.address, p.fraction]),
    ["address", "uint256"]
  );
  const cid = await storeData(JSON.stringify(tree.dump()));
  return { cid, root: tree.root as `0x{string}` };
};

export const useMintClaimAllowlist = ({
  onComplete,
  enabled,
}: {
  onComplete?: () => void;
  enabled: boolean;
}) => {
  const toast = useToast();
  const [cidUri, setCidUri] = useState<string>();
  const [units, setUnits] = useState<number>();
  const [merkleRoot, setMerkleRoot] = useState<`0x{string}`>();
  const [pairs, setPairs] = useState<{ address: string; fraction: number }[]>(
    []
  );

  const stepDescriptions = {
    storeTree: "Generating and storing merkle tree",
    uploading: "Uploading metadata to ipfs",
    writing: "Minting hypercert on-chain",
    storingEligibility: "Storing eligibility",
    complete: "Done minting",
  };

  const { setStep, showModal } = useContractModal();
  const parseBlockchainError = useParseBlockchainError();

  const initializeWrite = async (
    metaData: HypercertMetadata,
    units: number,
    pairs: { address: string; fraction: number }[]
  ) => {
    if (enabled) {
      setUnits(units);
      setStep("storeTree");
      const { cid: merkleCID, root } = await generateAndStoreTree(pairs);
      setStep("uploading");
      const cid = await storeMetadata({ ...metaData, allowList: merkleCID });
      setCidUri(cid);
      setMerkleRoot(root);
      setPairs(pairs);
      await addEligibility({
        claimId: "A",
        addresses: pairs.map(({ address }) => address),
      });
    }
  };

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    isLoading: isLoadingPrepareContractWrite,
    isSuccess: isReadyToWrite,
  } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    args: [BigNumber.from(units || 0), merkleRoot!, cidUri!, 2],
    abi: HyperCertMinterFactory.abi,
    functionName: "createAllowlist",
    onError: (error) => {
      parseBlockchainError(error, "the fallback");
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
    enabled: !!cidUri && units !== undefined && merkleRoot !== undefined,
  });

  const {
    data,
    error: writeError,
    isError: isWriteError,
    isLoading: isLoadingContractWrite,
    write,
  } = useContractWrite(config);

  const { mutateAsync: addEligibility } = useSheetsAddEligibility();
  const {
    isLoading: isLoadingWaitForTransaction,
    isError: isWaitError,
    error: waitError,
  } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: async (x) => {
      toast({
        description: mintInteractionLabels.toastSuccess("Success"),
        status: "success",
      });
      setStep("storingEligibility");
      console.log(data, x);
      await addEligibility({
        claimId: "A",
        addresses: pairs.map(({ address }) => address),
      });
      setStep("complete");
      onComplete?.();
    },
  });

  useEffect(() => {
    if (isReadyToWrite && write) {
      write();
    }
  }, [isReadyToWrite]);

  return {
    write: async (
      metaData: HypercertMetadata,
      pairs: { address: string; fraction: number }[]
    ) => {
      showModal({ stepDescriptions });
      setStep("preparing");
      await initializeWrite(
        metaData,
        _.sum(pairs.map((p) => p.fraction)),
        pairs
      );
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

export const useSheetsAddEligibility = () => {
  const url = `${SHEET_BEST_ENDPOINT}/tabs/MintEligibility`;

  return useMutation(
    ["add-sheets-eligibility"],
    ({ claimId, addresses }: { claimId: string; addresses: string[] }) => {
      const pairs = addresses.map((address) => ({ claim: claimId, address }));
      return fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pairs),
      });
    }
  );
};

export const useClaimEligibility = () => {
  const { address } = useAccount();

  return useQuery(
    ["sheets", "claim-eligibility", address],
    () =>
      fetch(
        `${SHEET_BEST_ENDPOINT}/tabs/MintEligibility/address/${address}`
      ).then(
        async (res) =>
          (await res.json()) as { address: string; claim: string }[]
      ),
    {
      cacheTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!address,
    }
  );
};
