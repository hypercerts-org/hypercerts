/*
  in order to adjust the build folder:
    1) import any files here you want in the final build package.
    2) copy the file path of the import.
    3) add the path to the ts.config.build.json under the { include: [...] } configuration.
    4) bump package.json version to publish a new package to npm.
*/
// ABIs
import ERC1155UpgradeableABI from "./abi/ERC1155Upgradeable.json";
import HypercertMinterABI from "./abi/HypercertMinter.json";
import IHypercertTokenABI from "./abi/IHypercertToken.json";
import SemiFungible1155ABI from "./abi/SemiFungible1155.json";

// ABIs
export { HypercertMinterABI, IHypercertTokenABI, SemiFungible1155ABI, ERC1155UpgradeableABI };

// Interfaces
export type { IHypercertToken } from "./types/src/interfaces/IHypercertToken";

// Contracts
export { HypercertMinter } from "./types/src/HypercertMinter";
export { AllowlistMinter } from "./types/src/AllowlistMinter";

// Factories
export { HypercertMinter__factory as HyperCertMinterFactory } from "./types/factories/src/HypercertMinter__factory";
