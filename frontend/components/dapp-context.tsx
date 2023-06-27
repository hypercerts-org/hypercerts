import { useAccountLowerCase } from "../hooks/account";
import { DEFAULT_CHAIN_ID, WALLETCONNECT_ID } from "../lib/config";
import { claimedRecently } from "./claim-all-fractions-button";
import { ContractInteractionDialogProvider } from "./contract-interaction-dialog-context";
import { PlasmicCanvasContext } from "@plasmicapp/loader-nextjs";
import { DataProvider } from "@plasmicapp/loader-nextjs";
import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import {
  argentWallet,
  bitskiWallet,
  braveWallet,
  coinbaseWallet,
  dawnWallet,
  imTokenWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  mewWallet,
  okxWallet,
  omniWallet,
  phantomWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  tahoWallet,
  trustWallet,
  walletConnectWallet,
  xdefiWallet,
  zerionWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { ReactNode, useEffect } from "react";
import {
  mainnet,
  goerli,
  sepolia,
  optimism,
  hardhat,
  Chain,
} from "viem/chains";
import { configureChains, WagmiConfig, useNetwork, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const DAPP_CONTEXT_NAME = "DappContext";

const queryClient = new QueryClient();
const ALL_CHAINS = [mainnet, goerli, sepolia, optimism, hardhat];
const { publicClient, chains } = configureChains(ALL_CHAINS, [
  publicProvider(),
]);

const projectId = WALLETCONNECT_ID;

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      argentWallet({ chains, projectId }),
      bitskiWallet({ chains }),
      braveWallet({ chains }),
      coinbaseWallet({ chains, appName: "Hypercerts" }),
      dawnWallet({ chains }),
      imTokenWallet({ chains, projectId }),
      ledgerWallet({ chains, projectId }),
      metaMaskWallet({ chains, projectId }),
      mewWallet({ chains }),
      okxWallet({ chains, projectId }),
      omniWallet({ chains, projectId }),
      phantomWallet({ chains }),
      rabbyWallet({ chains }),
      rainbowWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
      safeWallet({ chains }),
      tahoWallet({ chains }),
      trustWallet({ chains, projectId }),
      xdefiWallet({ chains }),
      zerionWallet({ chains, projectId }),
    ],
  },
  {
    groupName: "Injected",
    wallets: [injectedWallet({ chains })],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: false,
  publicClient,
  connectors,
});

export interface DappContextData {
  myAddress?: string;
  defaultChainId?: number;
  chain?: Chain;
  chains?: Chain[];
  waitToClaim?: boolean;
}

export const DEFAULT_TEST_DATA: DappContextData = {
  myAddress: "0x22E4b9b003Cc7B7149CF2135dfCe2BaddC7a534f".toLowerCase(),
  defaultChainId: 5,
  chain: goerli,
  chains: ALL_CHAINS,
  waitToClaim: false,
};

export interface DappContextProps {
  className?: string; // Plasmic CSS class
  children?: ReactNode; // Shown by default or if wallet is connected
  notConnected?: ReactNode; // Shown if wallet is not connected and `showIfNotConnected` is true
  showIfNotConnected?: boolean; // Show `notConnected` if wallet is not connected
  testData?: DappContextData; // Test data for
  useTestData?: boolean; //
}

export function DappContext(props: DappContextProps) {
  useEffect(() => {
    wagmiConfig.autoConnect();
  }, []);

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
  const data: DappContextData =
    useTestData && testData && inEditor
      ? testData
      : {
          myAddress: address,
          chain,
          chains,
          defaultChainId: DEFAULT_CHAIN_ID,
          waitToClaim,
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
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <QueryClientProvider client={queryClient}>
            <DataProvider name={DAPP_CONTEXT_NAME} data={data}>
              <ContractInteractionDialogProvider>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
              </ContractInteractionDialogProvider>
            </DataProvider>
          </QueryClientProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default DappContext;
