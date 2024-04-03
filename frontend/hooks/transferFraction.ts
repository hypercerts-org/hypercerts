import { useContractModal } from "../components/contract-interaction-dialog-context";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { toast } from "react-toastify";
import { useHypercertClient } from "./hypercerts-client";
import { useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { HypercertMinterAbi } from "@hypercerts-org/contracts";
import { SupportedChainIds } from "@hypercerts-org/sdk";
import { isAddress } from "viem";

export const useTransferFraction = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const [txPending, setTxPending] = useState(false);

  const { client, isLoading } = useHypercertClient();
  const { address, chain } = useAccount();
  const publicClient = usePublicClient();

  const { data: walletClient } = useWalletClient();
  const stepDescriptions = {
    transferring: "Transferring",
    waiting: "Awaiting confirmation",
    complete: "Done splitting",
  };

  const { setStep, showModal, hideModal } = useContractModal();
  const parseError = useParseBlockchainError();

  const initializeWrite = async (fractionId: bigint, to: string) => {
    if (!client) {
      toast("No hypercerts SDK client found", {
        type: "error",
      });
      return;
    }

    if (!publicClient) {
      toast("No evm client found", {
        type: "error",
      });
      return;
    }

    if (!address) {
      toast("No address found", {
        type: "error",
      });
      return;
    }

    const chainId = chain?.id;

    if (!chainId) return null;
    const deployments = client.getDeployments(chainId as SupportedChainIds);
    const contractAddress = deployments?.addresses?.HypercertMinterUUPS;

    if (!contractAddress || !isAddress(contractAddress.toLowerCase()))
      return null;

    const { request } = await publicClient.simulateContract({
      abi: HypercertMinterAbi,
      address: contractAddress,
      functionName: "safeTransferFrom",
      args: [address, to, fractionId, 1, ""],
      account: address,
    });

    showModal({ stepDescriptions });
    setStep("transferring");
    try {
      setTxPending(true);
      const hash = await walletClient?.writeContract(request);

      setStep("waiting");

      if (!hash) {
        toast("No tx hash returned", {
          type: "error",
        });
        return;
      }

      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });

      if (receipt?.status === "reverted") {
        toast("Splitting failed", {
          type: "error",
        });
        console.error(receipt);
      }
      if (receipt?.status === "success") {
        toast("Fraction successfully sent", { type: "success" });

        setStep("complete");
        onComplete?.();
      }
    } catch (error) {
      toast(parseError(error, "Fraction could not be sent"), {
        type: "error",
      });
      console.error(error);
    } finally {
      hideModal();
      setTxPending(false);
    }
  };

  return {
    write: async (id: bigint, to: string) => {
      try {
        await initializeWrite(id, to);
        window.location.reload();
      } catch (e) {
        console.error(e);
      }
    },
    txPending,
    readOnly: isLoading || !client || client.readonly,
  };
};
