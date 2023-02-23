import "@rainbow-me/rainbowkit/styles.css";

import React, { ReactNode } from "react";
import { PlasmicCanvasContext } from "@plasmicapp/loader-nextjs";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  configureChains,
  createClient,
  WagmiConfig,
  useNetwork,
  Chain,
} from "wagmi";
import { mainnet, goerli, sepolia, optimism, hardhat } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { DataProvider } from "@plasmicapp/loader-nextjs";
import { DEFAULT_CHAIN_ID, GRAPH_URL, SUPABASE_TABLE } from "../lib/config";
import { ContractInteractionDialogProvider } from "./contract-interaction-dialog-context";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAccountLowerCase } from "../hooks/account";

const DAPP_CONTEXT_NAME = "DappContext";

const queryClient = new QueryClient({});
const ALL_CHAINS = [mainnet, goerli, sepolia, optimism, hardhat];
const { provider, webSocketProvider, chains } = configureChains(ALL_CHAINS, [
  publicProvider(),
]);

const { connectors } = getDefaultWallets({
  appName: "Hypercerts",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors,
});

export interface DappContextData {
  myAddress?: string;
  defaultChainId?: string;
  chain?: Chain;
  chains?: Chain[];
  graphUrl?: string;
  supabaseTable?: string;
}

export const DEFAULT_TEST_DATA: DappContextData = {
  myAddress: "0x22E4b9b003Cc7B7149CF2135dfCe2BaddC7a534f".toLowerCase(),
  defaultChainId: "5",
  chain: goerli,
  chains: ALL_CHAINS,
  graphUrl:
    "https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-testnet",
  supabaseTable: "goerli-allowlistCache",
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
  const {
    className,
    children,
    notConnected,
    showIfNotConnected,
    testData,
    useTestData,
  } = props;

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
          graphUrl: GRAPH_URL,
          supabaseTable: SUPABASE_TABLE,
        };

  if (showIfNotConnected && !data.myAddress && notConnected) {
    return <div className={className}> {notConnected} </div>;
  }

  return (
    <div className={className}>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <DataProvider name={DAPP_CONTEXT_NAME} data={data}>
              <ContractInteractionDialogProvider>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
              </ContractInteractionDialogProvider>
            </DataProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </div>
  );
}

export default DappContext;
