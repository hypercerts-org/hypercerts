import { isProduction, WALLETCONNECT_ID } from "../lib/config";
import { ContractInteractionDialogProvider } from "./contract-interaction-dialog-context";
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
import { celo, Chain, goerli, optimism, sepolia } from "viem/chains";
import { configureChains, WagmiConfig, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import {
  Valora,
  CeloWallet,
  CeloTerminal,
  MetaMask as CeloMetaMask,
} from "@celo/rainbowkit-celo/wallets";

const queryClient = new QueryClient();

const TEST_CHAINS = [goerli, sepolia];
const PROD_CHAINS = [optimism, celo];

export const CHAINS = (isProduction ? PROD_CHAINS : TEST_CHAINS) as Chain[];

const { publicClient, chains } = configureChains(CHAINS, [publicProvider()]);

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
    groupName: "Recommended with CELO",
    wallets: [
      Valora({ chains, projectId }),
      CeloWallet({ chains, projectId }),
      CeloTerminal({ chains, projectId }),
      CeloMetaMask({ chains, projectId }),
      walletConnectWallet({ projectId, chains }),
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

export interface DappContextProps {
  children?: ReactNode; // Shown by default or if wallet is connected
}

export function DappContext({ children }: DappContextProps) {
  useEffect(() => {
    wagmiConfig.autoConnect();
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <QueryClientProvider client={queryClient}>
          <ContractInteractionDialogProvider>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </ContractInteractionDialogProvider>
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default DappContext;
