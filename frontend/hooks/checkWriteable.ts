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
    const currentErrors: { [key: string]: string } = {};

    if (!isConnected) {
      console.log("User not connected");
      currentErrors["connection"] =
        "You appear to not be connected. Please connect your wallet";
    }
    console.log(`address? ${address}`);

    if (!address || !isAddress(address)) {
      console.log("No address found");
      currentErrors[
        "address"
      ] = `No -valid- address found [${address}]. Please connect your wallet`;
    }

    if (!balance || balance.value == 0n) {
      console.log("No balance");
      currentErrors["balance"] = "Please add funds to your wallet";
    }

    if (!chain) {
      console.log("No chain found");
      currentErrors["chain"] =
        "No connection chain found. Please connect your wallet";
    }

    if (chain && chain.id !== chainID) {
      console.log(`On wrong network. Expect ${chainID} Saw ${chain?.id}`);
      currentErrors["chain"] = `Wrong network. Please connect to ${chainID}`;
    }
    if (!client || client.readonly) {
      console.log(
        "Client was not found or is in readonly mode. Review your config and connection",
      );
      currentErrors["client"] =
        "Client was not found or is in readonly mode. Review your config and connection";
    }

    if (Object.keys(currentErrors).length == 0) {
      console.log("no errors");
      setWriteable(true);
    } else {
      console.log("errors detected");
      setWriteable(false);
    }
    setErrors(currentErrors);

    setChecking(false);
  };

  return { checking, writeable, errors };
};

export default useCheckWriteable;
