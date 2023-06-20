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
import { BigNumberish } from "ethers";
import _, { set } from "lodash";
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
  ): Promise<{
    allowlist: AllowlistEntry[];
    totalSupply: BigNumberish;
    valid: boolean;
    errors: any;
  }> => {
    const allowlistFraction =
      (allowlistPercentage ?? DEFAULT_ALLOWLIST_PERCENTAGE) / 100.0;
    const htmlResult = await fetch(allowlistUrl, { method: "GET" });
    const htmlText = await htmlResult.text();
    try {
      const allowlist: AllowlistEntry[] = parseAllowlistCsv(htmlText, [
        {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          address: address!,
          // Creator gets the rest for now
          percentage: 1.0 - allowlistFraction,
        },
      ]);
      const totalSupply = _.sum(allowlist.map((x: AllowlistEntry) => x.units));

      const { valid, errors } = validateAllowlist(allowlist, totalSupply);

      console.log(valid, errors);
      return { allowlist, totalSupply, valid, errors };
    } catch (error) {
      return { allowlist: [], totalSupply: 0, valid: false, errors: error };
    }
  };

  const initializeWrite = async (
    metaData: HypercertMetadata,
    allowlistUrl: string,
    allowlistPercentage: number,
  ) => {
    setStep("validateAllowlist");

    const { allowlist, totalSupply, valid, errors } =
      await getAndUpdateAllowlist(allowlistUrl, allowlistPercentage);

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

    try {
      setStep("preparing");
      setTxPending(true);

      const tx = await client.createAllowlist(
        allowlist,
        metaData,
        totalSupply,
        TransferRestrictions.FromCreatorOnly,
      );
      setStep("writing");

      const receipt = await tx.wait(5);
      if (receipt.status === 0) {
        toast("Minting failed", {
          type: "error",
        });
        console.error(receipt);
      }
      if (receipt.status === 1) {
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
    }: {
      metaData: HypercertMetadata;
      allowlistUrl: string;
      allowlistPercentage: number;
    }) => {
      showModal({ stepDescriptions });
      await initializeWrite(metaData, allowlistUrl, allowlistPercentage);
    },
    txPending,
    readOnly: isLoading || !client || client.readonly,
  };
};
