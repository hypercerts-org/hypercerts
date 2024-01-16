import { createTask } from "./create-autotask";
import { createSentinel } from "./create-sentinel";
import { ApiError } from "./errors";
import { NetworkConfig, encodeName } from "./networks";
import {
  HypercertExchangeAbi,
  HypercertMinterAbi,
} from "@hypercerts-org/contracts";

export const rollOut = async (networks: NetworkConfig[]) => {
  return await Promise.all(
    networks.map(async (network) => {
      // On allowlist created
      const autoTaskOnAllowlistCreated = await createTask(
        encodeName(network, "minter", "on-allowlist-created"),
        "on-allowlist-created",
      );
      if (!autoTaskOnAllowlistCreated) {
        throw new ApiError(
          encodeName(
            network,
            "minter",
            "Could not create autoTask for on-allowlist-created",
          ),
        );
      }
      await createSentinel({
        name: encodeName(network, "minter", "AllowlistCreated"),
        network: network,
        contractAddress: network.hypercertMinterContractAddress,
        abi: HypercertMinterAbi,
        eventConditions: [
          { eventSignature: "AllowlistCreated(uint256,bytes32)" },
        ],
        autotaskID: autoTaskOnAllowlistCreated.autotaskId,
      });

      // On batch minted
      const autoTaskOnBatchMintClaimsFromAllowlists = await createTask(
        encodeName(network, "minter", "batch-mint-claims-from-allowlists"),
        "batch-mint-claims-from-allowlists",
      );
      if (!autoTaskOnBatchMintClaimsFromAllowlists) {
        throw new ApiError(
          encodeName(
            network,
            "minter",
            "Could not create autoTask for batch-mint-claims-from-allowlists",
          ),
        );
      }
      await createSentinel({
        name: encodeName(network, "minter", "batchMintClaimsFromAllowlists"),
        network: network,
        contractAddress: network.hypercertMinterContractAddress,
        abi: HypercertMinterAbi,
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
        encodeName(network, "minter", "mint-claim-from-allowlist"),
        "mint-claim-from-allowlist",
      );
      if (!autoTaskOnMintClaimFromAllowlist) {
        throw new ApiError(
          encodeName(
            network,
            "minter",
            "Could not create autoTask for mint-claim-from-allowlist",
          ),
        );
      }
      await createSentinel({
        name: encodeName(network, "minter", "mintClaimFromAllowlist"),
        network: network,
        contractAddress: network.hypercertMinterContractAddress,
        abi: HypercertMinterAbi,
        autotaskID: autoTaskOnMintClaimFromAllowlist.autotaskId,
        functionConditions: [
          {
            functionSignature:
              "mintClaimFromAllowlist(address,bytes32[],uint256,uint256)",
          },
        ],
      });

      if (network.hypercertExchangeContractAddress) {
        // On execute taker bid
        const autoTaskExecuteTakerBid = await createTask(
          encodeName(network, "exchange", "execute-taker-bid"),
          "execute-taker-bid",
        );
        if (!autoTaskExecuteTakerBid) {
          throw new ApiError(
            encodeName(
              network,
              "exchange",
              "Could not create autoTask for execute-taker-bid",
            ),
          );
        }
        await createSentinel({
          name: encodeName(network, "exchange", "executeTakerBid"),
          network: network,
          autotaskID: autoTaskExecuteTakerBid.autotaskId,
          contractAddress: network.hypercertExchangeContractAddress,
          abi: HypercertExchangeAbi,
          functionConditions: [
            {
              functionSignature:
                "executeTakerBid((address,bytes),(uint8,uint256,uint256,uint256,uint256,uint8,address,address,address,uint256,uint256,uint256,uint256[],uint256[],bytes),bytes,(bytes32,(bytes32,uint8)[]))",
            },
          ],
        });
      }
    }),
  );
};
