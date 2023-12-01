import { useContractModal } from "../components/contract-interaction-dialog-context";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { toast } from "react-toastify";
import { useHypercertClient } from "./hypercerts-client";
import { useState } from "react";
import { waitForTransactionReceipt, writeContract } from "viem/actions";
import { useAccount, useWalletClient } from "wagmi";

export const useTransferFraction = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const [txPending, setTxPending] = useState(false);

  const { client, isLoading } = useHypercertClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  const stepDescriptions = {
    transferring: "Transferring",
    waiting: "Awaiting confirmation",
    complete: "Done splitting",
  };

  const { setStep, showModal, hideModal } = useContractModal();
  const parseError = useParseBlockchainError();

  const initializeWrite = async (fractionId: bigint, to: string) => {
    if (!client) {
      toast("No client found", {
        type: "error",
      });
      return;
    }

    if (!walletClient) {
      toast("No wallet client found", {
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

    const hypercertMinterContract = client.contract;

    showModal({ stepDescriptions });
    setStep("transferring");
    try {
      setTxPending(true);
      const tx = await writeContract(walletClient, {
        ...hypercertMinterContract,
        functionName: "safeTransferFrom",
        args: [address, to, fractionId, 1, ""],
      });
      setStep("waiting");
      const receipt = await waitForTransactionReceipt(walletClient, {
        hash: tx,
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
        // window.location.reload();
      } catch (e) {
        console.error(e);
      }
    },
    txPending,
    readOnly: isLoading || !client || client.readonly,
  };
};
