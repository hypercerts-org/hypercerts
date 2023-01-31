import { BigNumber } from "ethers";
import { useContractModal } from "../components/contract-interaction-dialog-context";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import {
  getData,
  HypercertMetadata,
  storeData,
  storeMetadata,
} from "@network-goods/hypercerts-sdk";
import { mintInteractionLabels } from "../content/chainInteractions";
import { useEffect, useState } from "react";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { HyperCertMinterFactory } from "@network-goods/hypercerts-protocol";
import { CONTRACT_ADDRESS } from "../lib/config";
import _ from "lodash";
import { toast } from "react-toastify";

const generateAndStoreTree = async (
  pairs: { address: string; fraction: number }[],
) => {
  const tree = StandardMerkleTree.of(
    pairs.map((p) => [p.address, p.fraction]),
    ["address", "uint256"],
  );
  const cid = await storeData(JSON.stringify(tree.dump()));
  return { cid, root: tree.root as `0x{string}` };
};

export const useMintClaimAllowlist = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const [cidUri, setCidUri] = useState<string>();
  const [_units, setUnits] = useState<number>();
  const [merkleRoot, setMerkleRoot] = useState<`0x{string}`>();

  const stepDescriptions = {
    uploading: "Uploading metadata to ipfs",
    preparing: "Preparing contract write",
    writing: "Minting hypercert on-chain",
    storingEligibility: "Storing eligibility",
    complete: "Done minting",
  };

  const { setStep, showModal } = useContractModal();
  const parseBlockchainError = useParseBlockchainError();

  const initializeWrite = async ({
    metaData,
    allowlistUrl,
    pairs,
  }: {
    metaData: HypercertMetadata;
    allowlistUrl?: string;
    pairs?: { address: string; fraction: number }[];
  }) => {
    setStep("uploading");
    if (pairs) {
      // Handle manual creation of proof and merkle tree
      const { cid: merkleCID, root } = await generateAndStoreTree(pairs);
      const cid = await storeMetadata({ ...metaData, allowList: merkleCID });
      setCidUri(cid);
      setMerkleRoot(root);
      setUnits(_.sum(pairs.map((x) => x.fraction)));
    }
    if (allowlistUrl) {
      // Download existing tree to determine total number of units
      setCidUri(allowlistUrl);
      const treeResponse = await getData(allowlistUrl);

      if (!treeResponse) {
        throw new Error("Could not fetch json tree dump for allowlist");
      }

      const tree = StandardMerkleTree.load(JSON.parse(treeResponse));

      let totalUnits = 0;
      // Find the proof
      for (const [, v] of tree.entries()) {
        totalUnits += parseInt(v[1], 10);
      }

      setMerkleRoot(tree.root as `0x{string}`);
      setUnits(totalUnits);
    }
    setStep("Preparing");
  };

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    isLoading: isLoadingPrepareContractWrite,
    isSuccess: isReadyToWrite,
  } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    args: [
      BigNumber.from(_units || 0),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      merkleRoot!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      cidUri!,
      transferRestrictions.AllowAll,
    ],
    abi: HyperCertMinterFactory.abi,
    functionName: "createAllowlist",
    onError: (error) => {
      toast(parseBlockchainError(error, mintInteractionLabels.toastError), {
        type: "error",
      });
      console.error(error);
    },
    onSuccess: () => {
      setStep("writing");
    },
    enabled: !!cidUri && _units !== undefined && merkleRoot !== undefined,
  });

  const {
    data,
    error: writeError,
    isError: isWriteError,
    isLoading: isLoadingContractWrite,
    write,
  } = useContractWrite(config);

  const {
    isLoading: isLoadingWaitForTransaction,
    isError: isWaitError,
    error: waitError,
  } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: async () => {
      toast(mintInteractionLabels.toastSuccess, {
        type: "success",
      });
      setStep("storingEligibility");
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
    write: async ({
      metaData,
      allowlistUrl,
      pairs,
    }: {
      metaData: HypercertMetadata;
      allowlistUrl?: string;
      pairs?: { address: string; fraction: number }[];
    }) => {
      showModal({ stepDescriptions });
      await initializeWrite({
        metaData,
        pairs,
        allowlistUrl,
      });
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

const transferRestrictions = {
  AllowAll: 0,
  FromCreatorOnly: 1,
  DisallowAll: 2,
} as const;
