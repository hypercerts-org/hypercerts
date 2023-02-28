import { ethers } from "ethers";

import { getChainConfig } from "src/constants.js";

const chain = getChainConfig({});

export const provider = new ethers.providers.JsonRpcProvider(chain.rpc);
