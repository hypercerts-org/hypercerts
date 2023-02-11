import { BigNumber } from "ethers";
import { useContractModal } from "../components/contract-interaction-dialog-context";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import {
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
import { parseCsv } from "../lib/parse-csv";
import { transferRestrictions } from "./mintClaim";

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

  const { setStep, showModal, hideModal } = useContractModal();
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
      // fetch csv file
      try {
        const pairsFromCsv = await fetch(allowlistUrl, { method: "GET" }).then(
          async (data) => {
            const text = await data.text();
            const results = parseCsv(text);
            return results.map((row) => ({
              address: row["address"],
              fraction: parseInt(row["fractions"], 10),
            }));
          },
        );
        const { cid: merkleCID, root } = await generateAndStoreTree(
          pairsFromCsv,
        );
        const cid = await storeMetadata({ ...metaData, allowList: merkleCID });
        setCidUri(cid);
        setMerkleRoot(root);
        setUnits(_.sum(pairsFromCsv.map((x) => x.fraction)));
      } catch (e) {
        console.error(e);
        toast(
          "Something went wrong while generating merkle tree from the CSV file",
          { type: "error" },
        );
        hideModal();
      }
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
      transferRestrictions.FromCreatorOnly,
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
    onError: async () => {
      toast(mintInteractionLabels.toastRejected);
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
