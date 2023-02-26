import config from "./config.js";
import { createTask } from "./create-autotask.js";
import { createSentinel } from "./create-sentinel.js";
import { ApiError, ConfigError } from "./errors.js";
import { reset } from "./reset.js";
import { encodeName } from "./networks.js";

const setup = async () => {
  // Delete all sentinels and tasks first
  await reset();

  // Error out if no networks configured.
  if (config.networks.length < 1) {
    throw new ConfigError("No networks specified");
  }

  return await Promise.all(
    config.networks.map(async (network) => {
      // On allowlist created
      const autoTaskOnAllowlistCreated = await createTask(
        encodeName(network, "on-allowlist-created"),
        "on-allowlist-created",
      );
      if (!autoTaskOnAllowlistCreated) {
        throw new ApiError(
          encodeName(
            network,
            "Could not create autoTask for on-allowlist-created",
          ),
        );
      }
      await createSentinel({
        name: encodeName(network, "AllowlistCreated"),
        network: network,
        eventConditions: [
          { eventSignature: "AllowlistCreated(uint256,bytes32)" },
        ],
        autotaskID: autoTaskOnAllowlistCreated.autotaskId,
      });

      // On batch minted
      const autoTaskOnBatchMintClaimsFromAllowlists = await createTask(
        encodeName(network, "batch-mint-claims-from-allowlists"),
        "batch-mint-claims-from-allowlists",
      );
      if (!autoTaskOnBatchMintClaimsFromAllowlists) {
        throw new ApiError(
          encodeName(
            network,
            "Could not create autoTask for batch-mint-claims-from-allowlists",
          ),
        );
      }
      await createSentinel({
        name: encodeName(network, "batchMintClaimsFromAllowlists"),
        network: network,
        autotaskID: autoTaskOnBatchMintClaimsFromAllowlists.autotaskId,
        functionConditions: [
          {
            functionSignature:
              "batchMintClaimsFromAllowlists(address,bytes32[][],uint256[],uint256[])",
          },
        ],
      });

      // On single minted from allowlist
      const autoTaskOnMintClaimFromAllowlist = await createTask(
        encodeName(network, "mint-claim-from-allowlist"),
        "mint-claim-from-allowlist",
      );
      if (!autoTaskOnMintClaimFromAllowlist) {
        throw new ApiError(
          encodeName(
            network,
            "Could not create autoTask for mint-claim-from-allowlist",
          ),
        );
      }
      await createSentinel({
        name: encodeName(network, "mintClaimFromAllowlist"),
        network: network,
        autotaskID: autoTaskOnMintClaimFromAllowlist.autotaskId,
        functionConditions: [
          {
            functionSignature:
              "mintClaimFromAllowlist(address,bytes32[],uint256,uint256)",
          },
        ],
      });
    }),
  );
};

setup();
