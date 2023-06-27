import { useAccount, useBalance, useNetwork } from "wagmi";
import { DEFAULT_CHAIN_ID } from "../lib/config";
import { useHypercertClient } from "./hypercerts-client";
import { useEffect, useState } from "react";
import { isAddress } from "ethers/lib/utils";

const useCheckWriteable = (chainID = DEFAULT_CHAIN_ID) => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { client } = useHypercertClient();
  const { data: balance } = useBalance({
    address,
    enabled: !!address,
  });
  const [checking, setChecking] = useState(false);
  const [writeable, setWriteable] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>();

  useEffect(() => {
    const check = async () => {
      await checkWriteable();
    };
    check();
  }, [address, isConnected, balance, chain, client]);

  const checkWriteable = async () => {
    setChecking(true);

    if (!isConnected) {
      console.log("User not connected");
      setErrors({
        ...errors,
        connection:
          "You appear to not be connected. Please connect your wallet",
      });
      setWriteable(false);
    }

    if (!address || !isAddress(address)) {
      console.log("No address found");
      setErrors({
        ...errors,
        address: `No -valid- address found [${address}]. Please connect your wallet`,
      });
      setWriteable(false);
    }

    if (!balance || balance.value == 0n) {
      console.log("No balance");
      setErrors({ ...errors, balance: "Please add funds to your wallet" });
      setWriteable(false);
    }

    if (!chain) {
      console.log("No chain found");
      setErrors({
        ...errors,
        chain: "No connection chain found. Please connect your wallet",
      });
      setWriteable(false);
    }

    if (chain && chain.id !== chainID) {
      console.log(`On wrong network. Expect ${chainID} Saw ${chain?.id}`);
      setErrors({
        ...errors,
        chain: `Wrong network. Please connect to ${chainID}`,
      });
      setWriteable(false);
    }
    if (!client || client.readonly) {
      console.log(
        "Client was not found or is in readonly mode. Review your config and connection",
      );
      setErrors({
        ...errors,
        client:
          "Client was not found or is in readonly mode. Review your config and connection",
      });
      setWriteable(false);
    }

    if (!errors) {
      setWriteable(true);
    }

    setChecking(false);
  };

  return { checking, writeable, errors };
};

export default useCheckWriteable;
