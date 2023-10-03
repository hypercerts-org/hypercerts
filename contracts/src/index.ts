import HypercertMinterAbi from "./abi/HypercertMinter.json";
import { HypercertMinter__factory } from "./types/factories/src/HypercertMinter__factory";
import type { AllowlistMinter } from "./types/src/AllowlistMinter";
import type { HypercertMinter } from "./types/src/HypercertMinter";
import type { IAllowlist } from "./types/src/interfaces/IAllowlist";
import type { IHypercertToken } from "./types/src/interfaces/IHypercertToken";
import type { Errors } from "./types/src/libs/Errors";

/*
  in order to adjust the build folder:
    1) import any files here you want in the final build package.
    2) copy the file path of the import.
    3) add the path to the ts.config.build.json under the { include: [...] } configuration.
    4) bump package.json version to publish a new package to npm.
*/
// Interfaces
export { IAllowlist, IHypercertToken };
export { HypercertMinterAbi };

// Contracts
export { HypercertMinter, AllowlistMinter };

// Factories
export { HypercertMinter__factory as HypercertMinterFactory };

// Libs
export { Errors };
