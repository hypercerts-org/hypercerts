import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatAddress } from "../lib/formatting";
import { useAccountLowerCase } from "../hooks/account";

export const ConnectWallet = () => {
  const { address, isConnected } = useAccountLowerCase();
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
