import { ethers } from "ethers";

import { getChain } from "src/constants.js";

const chain = getChain();

export const provider = new ethers.providers.JsonRpcProvider(chain.rpc);
