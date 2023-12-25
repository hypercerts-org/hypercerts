import { useAccountLowerCase } from "../hooks/account";
import useCheckWriteable from "../hooks/checkWriteable";
import { claimedRecently } from "./claim-all-fractions-button";
import { PlasmicCanvasContext } from "@plasmicapp/loader-nextjs";
import { DataProvider } from "@plasmicapp/loader-nextjs";
import "@rainbow-me/rainbowkit/styles.css";
import React, { ReactNode } from "react";
import { optimism, hardhat, Chain, sepolia } from "viem/chains";
import { useNetwork } from "wagmi";

const DAPP_STATE_NAME = "DappState";

const ALL_CHAINS = [optimism, hardhat, sepolia];

export interface DappStateData {
  myAddress?: string;
  chain?: Chain;
  chains?: Chain[];
  waitToClaim?: boolean;
  writeable?: boolean;
}

//TODO revert to testnet data. Needed to override for local dev of WC-wagmi-safe integration
export const DEFAULT_TEST_DATA: DappStateData = {
  myAddress: "0x22E4b9b003Cc7B7149CF2135dfCe2BaddC7a534f".toLowerCase(),
  chain: optimism,
  chains: ALL_CHAINS,
  waitToClaim: false,
  writeable: true,
};

export interface DappStateProps {
  className?: string; // Plasmic CSS class
  children?: ReactNode; // Shown by default or if wallet is connected
  notConnected?: ReactNode; // Shown if wallet is not connected and `showIfNotConnected` is true
  showIfNotConnected?: boolean; // Show `notConnected` if wallet is not connected
  testData?: DappStateData; // Test data for
  useTestData?: boolean; //
}

export function DappState(props: DappStateProps) {
  const {
    className,
    children,
    notConnected,
    showIfNotConnected,
    testData,
    useTestData,
  } = props;
  const [waitToClaim, setWaitToClaim] = React.useState(false);

  const inEditor = React.useContext(PlasmicCanvasContext);
  const { address } = useAccountLowerCase();
  const { chain, chains } = useNetwork();
  const { writeable } = useCheckWriteable();
  const data: DappStateData =
    useTestData && testData && inEditor
      ? testData
      : {
          myAddress: address,
          chain,
          chains,
          waitToClaim,
          writeable,
        };

  React.useEffect(() => {
    // Reaches into window.localStorage, so doing it within a useEffect
    setWaitToClaim(claimedRecently());
  });

  if (showIfNotConnected && !data.myAddress && notConnected) {
    return <div className={className}> {notConnected} </div>;
  }

  return (
    <div className={className}>
      <DataProvider name={DAPP_STATE_NAME} data={data}>
        {children}
      </DataProvider>
    </div>
  );
}

export default DappState;
