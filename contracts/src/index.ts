import HypercertMinterAbi from "./abi/HypercertMinter.json";
// import { HypercertMinter__factory } from "./types/factories/src/HypercertMinter__factory";
import type { AllowlistMinter } from "./types/src/protocol/AllowlistMinter";
import type { HypercertMinter } from "./types/src/protocol/HypercertMinter";
import type { IAllowlist } from "./types/src/protocol/interfaces/IAllowlist";
import type { IHypercertToken } from "./types/src/protocol/interfaces/IHypercertToken";
import type { Errors } from "./types/src/protocol/libs/Errors";
/*
  in order to adjust the build folder:
    1) import any files here you want in the final build package.
    2) copy the file path of the import.
    3) add the path to the ts.config.build.json under the { include: [...] } configuration.
    4) bump package.json version to publish a new package to npm.
*/

// Factory
// export { HypercertMinter__factory };

// Interfaces
export { IAllowlist, IHypercertToken };
export { HypercertMinterAbi };

// Contracts
export { HypercertMinter, AllowlistMinter };

// Libs
export { Errors };
