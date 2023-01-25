import { formatAddress } from "../lib/formatting";

export const headerLinkLabels = {
  airdrop: "Airdrop",
  allowlist: "Allowlist",
  claim: "Claim",
  donate: "Donate",
  browse: "Browse",
  myTokens: "My Tokens",
};

export const connectButtonLabels = {
  connecting: "Connecting...",
  connected: "Connected",
  connect: "Connect Wallet",
  disconnect: (address: string) => `Disconnect ${formatAddress(address)}`,
};
