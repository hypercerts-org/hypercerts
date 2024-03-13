import config from "./config";
import { ApiError, ConfigError } from "./errors";
import { NETWORKS, getNetworkConfigFromName } from "./networks";
import { reset } from "./reset";
import { rollOut } from "./rollout";
import { updateAutotask, updateSentinel } from "./update";
import { AutotaskClient } from "@openzeppelin/defender-autotask-client";
import { SentinelClient } from "@openzeppelin/defender-sentinel-client";

const setup = async () => {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    throw new ApiError("Missing argument: <environment>");
  }

  const environment = args[0];
  const supportedEnv = Object.keys(NETWORKS);

  if (!supportedEnv.includes(environment)) {
    throw new ApiError("Invalid environment: <environment>");
  }

  const networks = config.networks[environment as keyof typeof NETWORKS];

  const autotaskClient = new AutotaskClient(config.credentials);
  const sentinelClient = new SentinelClient(config.credentials);

  // Remove all old auto tasks and sentinels
  const oldAutoTasks = await autotaskClient.list();
  const oldSentinels = await sentinelClient.list();

  const networksDeployed = oldAutoTasks.items
    .map((task) => getNetworkConfigFromName(task.name).chainId)
    .filter((value, index, array) => array.indexOf(value) === index);

  const missingNetworks = networks.filter(
    (network) => !networksDeployed.includes(network.chainId),
  );

  if (missingNetworks.length > 0) {
    await rollOut(missingNetworks);
  }

  let updates = false;

  if (oldAutoTasks.items.length > 0) {
    updates = true;
    await updateAutotask(networks);
  }

  if (oldSentinels.items.length > 0) {
    updates = true;
    await updateSentinel(networks);
  }

  if (!updates) {
    // Delete all sentinels and tasks first
    await reset();

    // Error out if no networks configured.
    if (networks.length < 1) {
      throw new ConfigError("No networks specified");
    }

    await rollOut(networks);
  }
};

//eslint-disable-next-line @typescript-eslint/no-floating-promises
setup();
