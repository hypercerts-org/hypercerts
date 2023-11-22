import { useState } from "react";
import { useContractModal } from "../components/contract-interaction-dialog-context";
import { mintInteractionLabels } from "../content/chainInteractions";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { parseAllowlistCsv } from "../lib/parsing";
import { useAccountLowerCase } from "./account";
import { useHypercertClient } from "./hypercerts-client";
import {
  HypercertMetadata,
  validateAllowlist,
  TransferRestrictions,
  AllowlistEntry,
} from "@hypercerts-org/sdk";
import { toast } from "react-toastify";

export const DEFAULT_ALLOWLIST_PERCENTAGE = 50;

export const useMintClaimAllowlist = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const [txPending, setTxPending] = useState(false);

  const { client, isLoading } = useHypercertClient();

  const stepDescriptions = {
    validateAllowlist: "Validating allowlist",
    uploading: "Uploading metadata to ipfs",
    preparing: "Preparing contract write",
    writing: "Minting hypercert on-chain",
    complete: "Done minting",
  };

  const { address } = useAccountLowerCase();
  const { setStep, showModal, hideModal } = useContractModal();
  const parseError = useParseBlockchainError();

  const getAndUpdateAllowlist = async (
    allowlistUrl: string,
    allowlistPercentage: number,
    deduplicate: boolean,
  ): Promise<{
    allowlist: AllowlistEntry[];
    totalSupply: bigint;
    valid: boolean;
    errors: any;
  }> => {
    const allowlistFraction =
      (allowlistPercentage ?? DEFAULT_ALLOWLIST_PERCENTAGE) / 100.0;
    const htmlResult = await fetch(allowlistUrl, { method: "GET" });
    const htmlText = await htmlResult.text();
    try {
      const allowlist: AllowlistEntry[] = parseAllowlistCsv(
        htmlText,
        deduplicate,
        allowlistFraction < 1
          ? [
              {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                address: address!,
                // Creator gets the rest for now
                percentage: 1.0 - allowlistFraction,
              },
            ]
          : undefined,
      );
      const totalSupply = allowlist.reduce(
        (acc: bigint, x: AllowlistEntry) => acc + BigInt(x.units.toString()),
        0n,
      );

      const { valid, errors } = validateAllowlist(allowlist, totalSupply);

      console.log(valid, errors);
      return { allowlist, totalSupply, valid, errors };
    } catch (error) {
      return { allowlist: [], totalSupply: 0n, valid: false, errors: error };
    }
  };

  const initializeWrite = async (
    metaData: HypercertMetadata,
    allowlistUrl: string,
    allowlistPercentage: number,
    deduplicate: boolean,
    transferRestrictions: TransferRestrictions,
  ) => {
    setStep("validateAllowlist");

    if (!client) {
      toast("No client found", {
        type: "error",
      });
      return;
    }

    let _totalSupply;
    let _allowlist: AllowlistEntry[];

    try {
      const { allowlist, totalSupply, valid, errors } =
        await getAndUpdateAllowlist(
          allowlistUrl,
          allowlistPercentage,
          deduplicate,
        );

      if (!valid) {
        toast("Errors found in allowlist. Check console for errors.", {
          type: "error",
        });
        for (const error of errors) {
          console.error(error);
        }
        hideModal();
        return;
      }

      _totalSupply = totalSupply;
      _allowlist = allowlist;
    } catch (e) {
      console.error("Unhandled Error: ", e);
      hideModal();
      return;
    }

    try {
      setStep("preparing");
      setTxPending(true);

      const hash = await client.createAllowlist(
        _allowlist,
        metaData,
        _totalSupply,
        transferRestrictions,
      );

      const publicClient = client.config.publicClient;
      const receipt = await publicClient?.waitForTransactionReceipt({
        confirmations: 3,
        hash: hash,
      });

      setStep("writing");

      if (receipt?.status === "reverted") {
        toast("Minting failed", {
          type: "error",
        });
        console.error(receipt);
      }
      if (receipt?.status === "success") {
        toast(mintInteractionLabels.toastSuccess, { type: "success" });

        setStep("complete");
        onComplete?.();
      }
    } catch (error) {
      toast(parseError(error, mintInteractionLabels.toastError), {
        type: "error",
      });
      console.error(error);
    } finally {
      hideModal();
      setTxPending(false);
    }
  };

  return {
    write: async ({
      metaData,
      allowlistUrl,
      allowlistPercentage,
      deduplicate,
      transferRestrictions = TransferRestrictions.FromCreatorOnly,
    }: {
      metaData: HypercertMetadata;
      allowlistUrl: string;
      allowlistPercentage: number;
      deduplicate: boolean;
      transferRestrictions?: TransferRestrictions;
    }) => {
      showModal({ stepDescriptions });
      await initializeWrite(
        metaData,
        allowlistUrl,
        allowlistPercentage,
        deduplicate,
        transferRestrictions,
      );
    },
    txPending,
    readOnly: isLoading || !client || client.readonly,
  };
};
