import { AutotaskClient } from "defender-autotask-client";
import { SentinelClient } from "defender-sentinel-client";
import config from "./config.js";
import { decodeName } from "./networks.js";
import { abi } from "./HypercertMinterABI.js";

export const updateAutotask = async () => {
  const autotaskClient = new AutotaskClient(config.credentials);

  // Remove all old auto tasks and sentinels
  const oldAutoTasks = await autotaskClient.list();
  return await Promise.all([
    ...oldAutoTasks.items.map((x) => {
      const { name } = decodeName(x.name);
      autotaskClient
        .updateCodeFromFolder(x.autotaskId, `./build/relay/${name}`)
        .then((res) => {
          console.log(`Updated ${x.autotaskId}`);
        });
    }),
  ]);
};

export const updateSentinel = async () => {
  const sentinelClient = new SentinelClient(config.credentials);

  // Remove all old auto tasks and sentinels
  const oldSentinels = await sentinelClient.list();
  return await Promise.all([
    ...oldSentinels.items.map((x) => {
      const { networkKey } = decodeName(x.name);
      const network = config.networks.find(
        (network) => network.networkKey === networkKey,
      );

      sentinelClient
        .update(x.subscriberId, {
          ...x,
          addresses: [network.contractAddress],
          abi,
        })
        .then((res) => {
          console.log("Updated: ", res);
        });
    }),
  ]);
};
