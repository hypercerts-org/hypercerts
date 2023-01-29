import { createTask } from "./create-autotasks.js";
import { apiKey, apiSecret, contractAddress } from "./config.js";
import { createAllowlistCreatedSentinel } from "./create-sentinels.js";
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

  const autoTask = await createTask("add cache entries on allowlist mint");

  if (!autoTask) {
    throw new Error("Could not create auto task");
  }

  await createAllowlistCreatedSentinel(contractAddress, autoTask.autotaskId);
};

setup();
