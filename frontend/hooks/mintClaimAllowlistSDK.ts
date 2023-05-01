import { useContractModal } from "../components/contract-interaction-dialog-context";
import { mintInteractionLabels } from "../content/chainInteractions";
import { useParseBlockchainError } from "../lib/parse-blockchain-error";
import { parseAllowlistCsv } from "../lib/parsing";
import { useAccountLowerCase } from "./account";
import {
  HypercertMetadata,
  validateAllowlist,
  TransferRestrictions,
  Allowlist,
  AllowlistEntry,
} from "@hypercerts-org/hypercerts-sdk";
import _ from "lodash";
import { toast } from "react-toastify";
import { useHypercertClient } from "./hypercerts-client";
import { BigNumberish } from "ethers";

export const DEFAULT_ALLOWLIST_PERCENTAGE = 50;

export const useMintClaimAllowlistSDK = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
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
    allowlist: Allowlist;
    totalSupply: BigNumberish;
    valid: boolean;
    errors: any;
  }> => {
    const allowlistFraction =
      (allowlistPercentage ?? DEFAULT_ALLOWLIST_PERCENTAGE) / 100.0;
    const htmlResult = await fetch(allowlistUrl, { method: "GET" });
    const htmlText = await htmlResult.text();
    const allowlist: Allowlist = parseAllowlistCsv(htmlText, [
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        address: address!,
        // Creator gets the rest for now
        percentage: 1.0 - allowlistFraction,
      },
    ]);
    const totalSupply = _.sum(allowlist.map((x: AllowlistEntry) => x.units));

    const { valid, errors } = validateAllowlist(allowlist, totalSupply);
    return { allowlist, totalSupply, valid, errors };
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
      console.error(errors);
      hideModal();
      return;
    }

    try {
      setStep("preparing");

      const tx = await client.createAllowlist(
        allowlist,
        metaData,
        totalSupply,
        TransferRestrictions.FromCreatorOnly,
      );
      setStep("writing");

      const receipt = await tx.wait();
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
    readOnly: isLoading || !client || client.readonly,
  };
};
