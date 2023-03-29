import { useContractModal } from "../components/contract-interaction-dialog-context";
import { mintInteractionLabels } from "../content/chainInteractions";
import { CONTRACT_ADDRESS } from "../lib/config";
import { cidToIpfsUri } from "../lib/formatting";
import { hypercertsStorage } from "../lib/hypercerts-storage";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { parseAllowlistCsv } from "../lib/parsing";
import { useAccountLowerCase } from "./account";
import { HyperCertMinterFactory } from "@hypercerts-org/hypercerts-protocol";
import {
  HypercertMetadata,
  HypercertMinting,
} from "@hypercerts-org/hypercerts-sdk";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { BigNumber } from "ethers";
import _ from "lodash";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

const generateAndStoreTree = async (
  pairs: { address: string; units: number }[],
) => {
  const tuples = pairs.map((p) => [p.address, p.units]);
  const tree = StandardMerkleTree.of(tuples, ["address", "uint256"]);
  const cid = await hypercertsStorage.storeData(JSON.stringify(tree.dump()));
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
  const minter = HypercertMinting({ provider: undefined, chainConfig: {} });

  const stepDescriptions = {
    uploading: "Uploading metadata to ipfs",
    preparing: "Preparing contract write",
    writing: "Minting hypercert on-chain",
    storingEligibility: "Storing eligibility",
    complete: "Done minting",
  };

  const { address } = useAccountLowerCase();
  const { setStep, showModal, hideModal } = useContractModal();
  const parseBlockchainError = useParseBlockchainError();

  const initializeWrite = async ({
    metaData,
    allowlistUrl,
    pairs,
  }: {
    metaData: HypercertMetadata;
    allowlistUrl?: string;
    pairs?: { address: string; units: number }[];
  }) => {
    setStep("uploading");
    if (pairs) {
      // Handle manual creation of proof and merkle tree
      const { cid: merkleCID, root } = await generateAndStoreTree(pairs);
      const cid = await hypercertsStorage.storeMetadata({
        ...metaData,
        allowList: cidToIpfsUri(merkleCID),
      });
      setCidUri(cidToIpfsUri(cid));
      setMerkleRoot(root);
      setUnits(_.sum(pairs.map((x) => x.units)));
    }
    if (allowlistUrl) {
      // fetch csv file
      try {
        const htmlResult = await fetch(allowlistUrl, { method: "GET" });
        const htmlText = await htmlResult.text();
        const allowlist = parseAllowlistCsv(htmlText, [
          {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            address: address!,
            percentage: 0.5,
          },
        ]);
        const totalSupply = _.sum(allowlist.map((x) => x.units));

        const { cid: merkleCID, root } = await generateAndStoreTree(allowlist);
        const cid = await hypercertsStorage.storeMetadata({
          ...metaData,
          allowList: cidToIpfsUri(merkleCID),
        });
        setCidUri(cidToIpfsUri(cid));
        setMerkleRoot(root);
        setUnits(totalSupply);
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      address! as `0x${string}`,
      BigNumber.from(_units || 0),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      merkleRoot!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      cidUri!,
      minter.transferRestrictions.FromCreatorOnly,
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
      pairs?: { address: string; units: number }[];
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
