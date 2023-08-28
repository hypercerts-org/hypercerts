import { AutotaskClient } from "defender-autotask-client";
import { SentinelClient } from "defender-sentinel-client";
import config from "./config.js";
import { decodeName } from "./networks.js";
import { abi } from "./HypercertMinterABI.js";

export const updateAutotask = async () => {
  const autotaskClient = new AutotaskClient(config.credentials);

  const oldAutoTasks = await autotaskClient.list();
  return await Promise.all([
    ...oldAutoTasks.items.map((autoTask) => {
      const { name } = decodeName(autoTask.name);
      autotaskClient
        .updateCodeFromFolder(autoTask.autotaskId, `./build/relay/${name}`)
        .then((res) => {
          console.log(`Updated ${autoTask.autotaskId}: ${res}`);
        })
        .catch((err) => {
          console.log(`Error updating ${autoTask.autotaskId}: ${err}`);
        });
    }),
  ]);
};

export const updateSentinel = async () => {
  const sentinelClient = new SentinelClient(config.credentials);

  const oldSentinels = await sentinelClient.list();
  return await Promise.all([
    ...oldSentinels.items.map((sentinel) => {
      const { networkKey } = decodeName(sentinel.name);
      const network = config.networks.find(
        (network) => network.networkKey === networkKey,
      );

      sentinelClient
        .update(sentinel.subscriberId, {
          ...sentinel,
          addresses: [network.contractAddress],
          abi,
        })
        .then((res) => {
          console.log(`Updated ${sentinel.name}: ${res}`);
        })
        .catch((err) => {
          console.log(`Error updating ${sentinel.name}: ${err}`);
        });
    }),
  ]);
};
