import { abi as HypercertMinterAbi } from "./HypercertMinterABI";
import config from "./config";
import { NetworkConfig, decodeName } from "./networks";
import { AutotaskClient } from "@openzeppelin/defender-autotask-client";
import { SentinelClient } from "@openzeppelin/defender-sentinel-client";
import {
  asDeployedChain,
  deployments,
  HypercertExchangeAbi,
} from "@hypercerts-org/contracts";

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
        .then((res) => {
          console.log(`Updated ${autoTask.autotaskId}`);
          console.log(res);
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
      const { name, networkKey, contract } = decodeName(sentinel.name);

      // Validate if in target networks

      let address: string | undefined;
      let abi: any;

      if (!targetNetworks.includes(networkKey as NetworkConfig["networkKey"])) {
        return;
      }
      const network = networks.find(
        (network) => network.networkKey === networkKey,
      );

      if (contract === "minter") {
        address = network?.contractAddress;
        abi = HypercertMinterAbi;
      }

      if (contract === "exchange") {
        const deployment =
          deployments[asDeployedChain(network.chainId.toString())];
        address = deployment.HypercertExchange;
        abi = HypercertExchangeAbi;
      }

      if (!address) {
        console.error(`No address found for ${sentinel.subscriberId}`);
        return;
      }
      if (!abi) {
        console.error(`No abi found for ${sentinel.subscriberId}`);
        return;
      }

      // Update sentinel
      console.log(
        `Updating ${sentinel.subscriberId} from ./build/relay/${name} on ${networkKey}`,
      );

      sentinelClient
        .update(sentinel.subscriberId, {
          ...sentinel,
          addresses: [address],
          abi,
        })
        .then((res) => {
          console.log(`Updated: ", ${sentinel.subscriberId}`);
          console.log(res);
        })
        .catch((err) => {
          console.error(`Failed to update ${sentinel.subscriberId}`);
          console.error(err);
        });
    }),
  ]);
};
