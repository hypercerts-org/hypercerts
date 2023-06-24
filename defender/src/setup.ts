import config from "./config.js";

import { ApiError, ConfigError } from "./errors.js";
import { reset } from "./reset.js";
import { AutotaskClient } from "defender-autotask-client";
import { SentinelClient } from "defender-sentinel-client";
import { updateAutotask, updateSentinel } from "./update.js";
import { rollOut } from "./rollout.js";

const setup = async () => {
  const autotaskClient = new AutotaskClient(config.credentials);
  const sentinelClient = new SentinelClient(config.credentials);

  // Remove all old auto tasks and sentinels
  const oldAutoTasks = await autotaskClient.list();
  const oldSentinels = await sentinelClient.list();

  let updates = false;

  if (oldAutoTasks.items.length > 0) {
    updates = true;
    updateAutotask();
  }

  if (oldSentinels.items.length > 0) {
    updates = true;
    updateSentinel();
  }

  if (!updates) {
    // Delete all sentinels and tasks first
    await reset();

    // Error out if no networks configured.
    if (config.networks.length < 1) {
      throw new ConfigError("No networks specified");
    }

    rollOut();
  }
};

setup();
