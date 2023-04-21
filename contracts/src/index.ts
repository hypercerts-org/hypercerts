/*
  in order to adjust the build folder:
    1) import any files here you want in the final build package.
    2) copy the file path of the import.
    3) add the path to the ts.config.build.json under the { include: [...] } configuration.
    4) bump package.json version to publish a new package to npm.
*/
import ERC1155UpgradeableABI from "../abi/ERC1155Upgradeable.json";
import HypercertMinterABI from "../abi/HypercertMinter.json";
import IHypercertTokenABI from "../abi/IHypercertToken.json";
import SemiFungible1155ABI from "../abi/SemiFungible1155.json";
import { AllowlistMinter, ERC1155Upgradeable, HypercertMinter, HypercertMinter__factory } from "./types";

// ABIs
export { HypercertMinterABI, IHypercertTokenABI, SemiFungible1155ABI, ERC1155UpgradeableABI };

// Interfaces
export { ERC1155Upgradeable };

// // Contracts
export { HypercertMinter, AllowlistMinter };

// // Factories
export { HypercertMinter__factory as HyperCertMinterFactory };
