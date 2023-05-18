/*
  in order to adjust the build folder:
    1) import any files here you want in the final build package.
    2) copy the file path of the import.
    3) add the path to the ts.config.build.json under the { include: [...] } configuration.
    4) bump package.json version to publish a new package to npm.
*/
// ABIs
import ERC1155UpgradeableABI from "../abi/ERC1155Upgradeable.json" assert { type: "json" };
import HypercertMinterABI from "../abi/HypercertMinter.json" assert { type: "json" };
import IHypercertTokenABI from "../abi/IHypercertToken.json" assert { type: "json" };
import SemiFungible1155ABI from "../abi/SemiFungible1155.json" assert { type: "json" };

// ABIs
export { HypercertMinterABI, IHypercertTokenABI, SemiFungible1155ABI, ERC1155UpgradeableABI };

// Interfaces
export type { IHypercertToken } from "../typechain/src/interfaces/IHypercertToken";

// Contracts
export { HypercertMinter } from "../typechain/src/HypercertMinter";
export { AllowlistMinter } from "../typechain/src/AllowlistMinter";

// Factories
export { HypercertMinter__factory as HyperCertMinterFactory } from "../typechain/factories/src/HypercertMinter__factory";
