import { createTask } from "./create-autotasks";
import { createMintClaimSentinel } from "./create-sentinels";
import { contractAddress } from "./config";
const setup = async () => {
  if (!contractAddress) {
    throw new Error("No contract address specified");
  }

  const autoTaskId = await createTask("add cache entries on allowlist mint");

  if (autoTaskId) {
    await createMintClaimSentinel(
      "Create mint claim",
      contractAddress,
      "a",
      autoTaskId,
    );
  }
};

setup();
