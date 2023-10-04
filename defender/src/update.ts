import { abi } from "./HypercertMinterABI.js";
import config from "./config.js";
import { NetworkConfig, decodeName } from "./networks.js";
import { AutotaskClient } from "@openzeppelin/defender-autotask-client";
import { SentinelClient } from "@openzeppelin/defender-sentinel-client";

export const updateAutotask = async (networks: NetworkConfig[]) => {
  const autotaskClient = new AutotaskClient(config.credentials);
  const targetNetworks = networks.map((network) => network.networkKey);

  const oldAutoTasks = await autotaskClient.list();

  return await Promise.all([
    ...oldAutoTasks.items.map((autoTask) => {
      // Get name and network
      const { name, networkKey } = decodeName(autoTask.name);

      // Validate if in target networks
      if (!targetNetworks.includes(networkKey as NetworkConfig["networkKey"])) {
        return;
      }

      // Update autotask
      console.log(
        `Updating ${autoTask.autotaskId} from ./build/relay/${name} on ${networkKey}`,
      );

      autotaskClient
        .updateCodeFromFolder(autoTask.autotaskId, `./build/relay/${name}`)
        .then((_) => {
          console.log(`Updated ${autoTask.autotaskId}`);
        })
        .catch((err) => {
          console.error(`Failed to update ${autoTask.autotaskId}`);
          console.error(err);
        });
    }),
  ]);
};

export const updateSentinel = async (networks: NetworkConfig[]) => {
  const sentinelClient = new SentinelClient(config.credentials);
  const targetNetworks = networks.map((network) => network.networkKey);

  const oldSentinels = await sentinelClient.list();
  return await Promise.all([
    ...oldSentinels.items.map((sentinel) => {
      // Get name and network
      const { name, networkKey } = decodeName(sentinel.name);

      // Validate if in target networks
      if (!targetNetworks.includes(networkKey as NetworkConfig["networkKey"])) {
        return;
      }
      const network = networks.find(
        (network) => network.networkKey === networkKey,
      );

      // Update sentinel
      console.log(
        `Updating ${sentinel.subscriberId} from ./build/relay/${name} on ${networkKey}`,
      );

      sentinelClient
        .update(sentinel.subscriberId, {
          ...sentinel,
          addresses: [network.contractAddress],
          abi,
        })
        .then((_) => {
          console.log(`Updated: ", ${sentinel.subscriberId}`);
        })
        .catch((err) => {
          console.error(`Failed to update ${sentinel.subscriberId}`);
          console.error(err);
        });
    }),
  ]);
};
