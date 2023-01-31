import { AutotaskClient } from "defender-autotask-client";
import { SentinelClient } from "defender-sentinel-client";

import { apiKey, apiSecret, contractAddress } from "./config.js";

import { createTask } from "./create-autotask.js";
import { createSentinel } from "./create-sentinel.js";

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

  // On single minted from allowlist
  const autoTaskOnMintClaimFromAllowlist = await createTask(
    "remove cache entry on mint claim from allowlist",
    "mint-claim-from-allowlist",
  );
  if (!autoTaskOnMintClaimFromAllowlist) {
    throw new Error("Could not create autoTask for mint-claim-from-allowlist");
  }
  await createSentinel({
    name: "mintClaimFromAllowlist",
    address: contractAddress,
    autotaskID: autoTaskOnMintClaimFromAllowlist.autotaskId,
    functionConditions: [
      {
        functionSignature: "mintClaimFromAllowlist(bytes32[],uint256,uint256)",
      },
    ],
  });
};

setup();
