import { createTask } from "./create-autotasks.js";
import { apiKey, apiSecret, contractAddress } from "./config.js";
import { createSentinel } from "./create-sentinels.js";
import { AutotaskClient } from "defender-autotask-client";
import { SentinelClient } from "defender-sentinel-client";

const credentials = {
  apiKey,
  apiSecret,
};
const autotaskClient = new AutotaskClient(credentials);
export const sentinelClient = new SentinelClient(credentials);
const setup = async () => {
  // Remove all old auto tasks and sentinels
  const oldAutoTasks = await autotaskClient.list();
  const oldSentinels = await sentinelClient.list();
  await Promise.all([
    ...oldAutoTasks.items.map((x) =>
      autotaskClient.delete(x.autotaskId).then((res) => {
        console.log(res.message);
      }),
    ),
    ...oldSentinels.items.map((x) =>
      sentinelClient.delete(x.subscriberId).then((res) => {
        console.log(res.message);
      }),
    ),
  ]);

  // TODO: Seems like you have to use the direct address, proxies don't work
  if (!contractAddress) {
    throw new Error("No contract address specified");
  }

  // On allowlist created
  const autoTaskOnAllowlistCreated = await createTask(
    "add cache entries on allowlist mint",
    "on-allowlist-created",
  );
  if (!autoTaskOnAllowlistCreated) {
    throw new Error("Could not create autoTask for on-allowlist-created");
  }
  await createSentinel({
    name: "AllowlistCreated",
    address: contractAddress,
    eventConditions: [{ eventSignature: "AllowlistCreated(uint256,bytes32)" }],
    autotaskID: autoTaskOnAllowlistCreated.autotaskId,
  });

  // On batch minted
  const autoTaskOnBatchMintClaimsFromAllowlists = await createTask(
    "remove cache entries on batch mint",
    "batch-mint-claims-from-allowlists",
  );
  if (!autoTaskOnBatchMintClaimsFromAllowlists) {
    throw new Error(
      "Could not create autoTask for batch-mint-claims-from-allowlists",
    );
  }
  await createSentinel({
    name: "batchMintClaimsFromAllowlists",
    address: contractAddress,
    autotaskID: autoTaskOnBatchMintClaimsFromAllowlists.autotaskId,
    functionConditions: [
      {
        functionSignature:
          "batchMintClaimsFromAllowlists(bytes32[][],uint256[],uint256[])",
      },
    ],
  });
};

setup();
