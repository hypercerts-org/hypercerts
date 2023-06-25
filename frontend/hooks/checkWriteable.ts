import { useAccount, useBalance, useNetwork } from "wagmi";
import { toast } from "react-toastify";
import { DEFAULT_CHAIN_ID } from "../lib/config";
import { useHypercertClient } from "./hypercerts-client";
import { useEffect, useState } from "react";

const useCheckWriteable = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { client } = useHypercertClient();
  const { data: balance } = useBalance({
    address,
    enabled: !!address,
  });
  const [writeable, setWriteable] = useState(false);

  useEffect(() => {
    const check = async () => {
      const writeable = await checkWriteable(true);
      setWriteable(writeable);
    };
    check();
  }, [address, isConnected, balance, chain, client]);

  const checkWriteable = async (silent = false) => {
    if (!address || !isConnected) {
      console.log("User not connected");
      !silent ? toast("Please connect your wallet", { type: "error" }) : null;
      return false;
    }

    if (!balance || balance.value == 0n) {
      console.log("No balance");
      !silent
        ? toast(`No balance found for wallet ${address}`, { type: "error" })
        : null;
      return false;
    }

    if (!chain) {
      console.log("No chain found");
      silent ? toast(`No chain found`, { type: "error" }) : null;
      return false;
    }

    if (chain.id !== DEFAULT_CHAIN_ID) {
      console.log(
        `On wrong network. Expect ${DEFAULT_CHAIN_ID} Saw ${chain?.id}`,
      );
      silent
        ? toast("Please connect to the correct network first.", {
            type: "error",
          })
        : null;
      return false;
    }
    if (!client || client.readonly) {
      silent
        ? toast("Client not found or in readonly mode. Are you connected?", {
            type: "warning",
          })
        : null;
      return false;
    }
    return true;
  };

  return { checkWriteable, writeable };
};

export default useCheckWriteable;
