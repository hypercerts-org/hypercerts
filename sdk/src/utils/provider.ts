import { ethers } from "ethers";

import { getChain } from "src/constants.js";

const chain = getChain();

export const provider = ethers.getDefaultProvider(chain.rpc);
