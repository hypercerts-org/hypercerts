import { AutotaskClient } from "defender-autotask-client";
import { SentinelClient } from "defender-sentinel-client";
import config from "./config.js";

export const reset = async () => {
  const autotaskClient = new AutotaskClient(config.credentials);
  const sentinelClient = new SentinelClient(config.credentials);

  // Remove all old auto tasks and sentinels
  const oldAutoTasks = await autotaskClient.list();
  const oldSentinels = await sentinelClient.list();
  return await Promise.all([
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
};
