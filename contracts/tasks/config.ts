// Define supported networks and their tokens
type NetworkTokens = {
  [network: string]: {
    tokens: {
      symbol: string;
      address: string;
      faucetUrl?: string;
    }[];
  };
};

const NETWORK_TOKENS: NetworkTokens = {
  localhost: {
    tokens: [
      { symbol: "ETH", address: "0x0000000000000000000000000000000000000000" },
      { symbol: "WETH", address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9" },
      { symbol: "DAI", address: "0x779877A7B0D9E8603169DdbD7836e478b4624789" },
      { symbol: "USDC", address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" },
    ],
  },
  hardhat: {
    tokens: [{ symbol: "ETH", address: "0x0000000000000000000000000000000000000000" }],
  },
  sepolia: {
    tokens: [
      { symbol: "ETH", address: "0x0000000000000000000000000000000000000000" },
      { symbol: "WETH", address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9" },
      {
        symbol: "DAI",
        address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        faucetUrl: "https://faucets.chain.link/",
      },
      {
        symbol: "USDC",
        address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        faucetUrl: "https://faucet.circle.com/",
      },
    ],
  },
  "optimism-mainnet": {
    tokens: [
      { symbol: "ETH", address: "0x0000000000000000000000000000000000000000" },
      { symbol: "WETH", address: "0x4200000000000000000000000000000000000006" },
      { symbol: "DAI", address: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1" },
      { symbol: "USDC", address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85" },
    ],
  },
  "base-sepolia": {
    tokens: [
      { symbol: "ETH", address: "0x0000000000000000000000000000000000000000" },
      { symbol: "WETH", address: "0x4200000000000000000000000000000000000006" },
      { symbol: "DAI", address: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410" },
      { symbol: "USDC", address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" },
    ],
  },
  "arb-sepolia": {
    tokens: [
      { symbol: "ETH", address: "0x0000000000000000000000000000000000000000" },
      { symbol: "WETH", address: "0x3031a6D5D9648BA5f50f656Cd4a1672E1167a34A" },
      { symbol: "DAI", address: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E" },
      { symbol: "USDC", address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" },
    ],
  },
  arbitrumOne: {
    tokens: [
      { symbol: "ETH", address: "0x0000000000000000000000000000000000000000" },
      { symbol: "WETH", address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1" },
      { symbol: "DAI", address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1" },
      { symbol: "USDC", address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" },
    ],
  },
  "celo-mainnet": {
    //https://docs.celo.org/cel2/fee-currencies
    tokens: [
      {
        symbol: "CELO",
        address: "0x471EcE3750Da237f93B8E339c536989b8978a438", // NO support for CELO as zero-address, as that breaks the marketplace flow on receiving and wrapping native tokens (no wrapper on Celo)
      },
      {
        symbol: "cUSD",
        address: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
      },
      {
        symbol: "USDC",
        address: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
      },
      {
        symbol: "USDT",
        address: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
      },
    ],
  },
};

// New helper functions
export const getSupportedTokens = (network: string) => {
  const networkConfig = NETWORK_TOKENS[network];
  if (!networkConfig) {
    throw new Error(`Network "${network}" is not supported`);
  }
  return networkConfig.tokens;
};

export const getTokenAddress = (network: string, symbol: string) => {
  const tokens = getSupportedTokens(network);
  const token = tokens.find((t) => t.symbol === symbol);
  if (!token) {
    throw new Error(`Token "${symbol}" is not supported on network "${network}"`);
  }
  return token.address;
};

const ADMIN_ACCOUNT: { [key: string]: string } = {
  localhost: "0x4f37308832c6eFE5A74737955cBa96257d76De17",
  hardhat: "0x4f37308832c6eFE5A74737955cBa96257d76De17",
  sepolia: "0x4f37308832c6eFE5A74737955cBa96257d76De17",
  "base-sepolia": "0xA2Cb9D926b090577AD45fC0F40C753BF369B82Ff",
  "optimism-mainnet": "0x560adA72a80b4707e493cA8c3B7B7528930E7Be5",
  "celo-mainnet": "0x14ae502FEF3843fF3a1735B3209D39B320130af9",
  base: "0x14ae502FEF3843fF3a1735B3209D39B320130af9",
  arbitrumOne: "0x14ae502FEF3843fF3a1735B3209D39B320130af9",
  "arb-sepolia": "0x5d36971451AE593685Cab8815d644f9B4B66Ec99",
};

export const getAdminAccount = (network: string): string => {
  const account = ADMIN_ACCOUNT[network];

  if (!account || account === null || account.trim() === "") {
    throw new Error(`Admin account for network "${network}" is not defined, null, or empty.`);
  }

  return account;
};

const FEE_RECIPIENT: { [key: string]: string } = {
  localhost: "0x4f37308832c6eFE5A74737955cBa96257d76De17",
  hardhat: "0x4f37308832c6eFE5A74737955cBa96257d76De17",
  sepolia: "0x4f37308832c6eFE5A74737955cBa96257d76De17",
  "base-sepolia": "0xe518aED97D9d45174a06bB8EF663B4fB51330725",
  "optimism-mainnet": "0xE7C4531ad8828794904D332a12702beC8ff1A498",
  "celo-mainnet": "0xE7C4531ad8828794904D332a12702beC8ff1A498",
  base: "0xE7C4531ad8828794904D332a12702beC8ff1A498",
  arbitrumOne: "0xE7C4531ad8828794904D332a12702beC8ff1A498",
  "arb-sepolia": "0x5d36971451AE593685Cab8815d644f9B4B66Ec99",
};

export const getFeeRecipient = (network: string): string => {
  const recipient = FEE_RECIPIENT[network];

  if (!recipient || recipient === null || recipient.trim() === "") {
    throw new Error(`Fee recipient for network "${network}" is not defined, null, or empty.`);
  }

  return recipient;
};
