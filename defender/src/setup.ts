import { createTask } from "./create-autotasks.js";
import { contractAddress } from "./config.js";
import { createMintClaimSentinel } from "./create-sentinels.js";
const setup = async () => {
  if (!contractAddress) {
    throw new Error("No contract address specified");
  }

  const autoTask = await createTask("add cache entries on allowlist mint");

  if (!autoTask) {
    throw new Error("Could not create auto task");
  }

  await createMintClaimSentinel(
    "Create mint claim",
    contractAddress,
    "a",
    autoTask.autotaskId,
  );
};

setup();
