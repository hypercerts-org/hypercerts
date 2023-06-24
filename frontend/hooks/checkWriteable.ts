import { fetchBalance } from "@wagmi/core";
import { useAccount, useNetwork } from "wagmi";
import { toast } from "react-toastify";
import { DEFAULT_CHAIN_ID } from "../lib/config";
import { useHypercertClient } from "./hypercerts-client";

const useCheckWriteable = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { client } = useHypercertClient();

  const checkWriteable = async () => {
    if (!address || !isConnected) {
      console.log("User not connected");
      toast("Please connect your wallet", { type: "error" });
      return;
    }

    const { value } = await fetchBalance({
      address,
    });

    if (!value || value == 0n) {
      console.log("No balance");
      toast(`No balance found for wallet ${address}`, { type: "error" });
      return;
    }

    if (!chain) {
      console.log("No chain found");
      toast(`No chain found`, { type: "error" });
      return;
    }

    if (chain.id !== DEFAULT_CHAIN_ID) {
      console.log(
        `On wrong network. Expect ${DEFAULT_CHAIN_ID} Saw ${chain?.id}`,
      );
      toast("Please connect to the correct network first.", {
        type: "error",
      });
      return;
    }
    if (!client || client.readonly) {
      toast("Client not found or in readonly mode. Are you connected?", {
        type: "warning",
      });
      return;
    }
    return true;
  };

  return { checkWriteable };
};

export default useCheckWriteable;
