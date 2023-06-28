import { useAccount } from "wagmi";
import { formatAddress } from "../lib/formatting";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

export const ConnectWallet = () => {
  const { address, isConnected } = useAccount();
  /**
   * TODO: Sometimes the modal wont close when react strict mode is on.
   * Shouldn't happen in production because strict mode is turned off there
   * Related to https://github.com/Network-Goods/hypercerts-protocol/issues/80
   */
  return (
    <ConnectButton
      showBalance={false}
      chainStatus="none"
      label={
        isConnected
          ? "Connected"
          : address
          ? `Disconnect ${formatAddress(address)}`
          : "Connect Wallet"
      }
    />
  );
};

export default ConnectWallet;
