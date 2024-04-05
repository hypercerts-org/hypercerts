import { isProduction, WALLETCONNECT_ID } from "../lib/config";
import { ContractInteractionDialogProvider } from "./contract-interaction-dialog-context";
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
import React, { ReactNode } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base, baseSepolia, celo, optimism, sepolia } from "wagmi/chains";
import {
  Chain,
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import { Transport } from "viem";

const queryClient = new QueryClient();

const TEST_CHAINS = [sepolia, baseSepolia] as const;
const PROD_CHAINS = [optimism, celo, base] as const;

export const chains: readonly [Chain, ...Chain[]] = isProduction
  ? PROD_CHAINS
  : TEST_CHAINS;

const transports: Record<number, Transport> = isProduction
  ? ({
      [celo.id]: http(),
      [optimism.id]: http(),
      [base.id]: http(),
    } as const)
  : ({
      [sepolia.id]: http(),
      [baseSepolia.id]: http(),
    } as const);

const projectId = WALLETCONNECT_ID;

// For current state of Celo wallets see https://github.com/celo-org/rainbowkit-celo/issues/86
const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        argentWallet,
        bitskiWallet,
        braveWallet,
        coinbaseWallet,
        dawnWallet,
        imTokenWallet,
        ledgerWallet,
        metaMaskWallet,
        mewWallet,
        okxWallet,
        omniWallet,
        phantomWallet,
        rabbyWallet,
        rainbowWallet,
        walletConnectWallet,
        safeWallet,
        tahoWallet,
        trustWallet,
        xdefiWallet,
        zerionWallet,
      ],
    },
    {
      groupName: "Recommended with CELO",
      wallets: [metaMaskWallet, walletConnectWallet],
    },
    {
      groupName: "Injected",
      wallets: [injectedWallet],
    },
  ],
  {
    appName: "Hypercerts",
    projectId,
  },
);

const wagmiConfig = createConfig({
  connectors,
  chains,
  transports,
  ssr: true,
});

export interface DappContextProps {
  children?: ReactNode; // Shown by default or if wallet is connected
}

export function DappContext({ children }: DappContextProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ContractInteractionDialogProvider>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </ContractInteractionDialogProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default DappContext;
