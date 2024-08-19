import deployments_marketplace_base_sepolia from "./deployment-marketplace-base-sepolia.json"
import deployments_marketplace_sepolia from "./deployment-marketplace-sepolia.json";
import deployments_protocol from "./deployments-protocol.json";

const deployments_marketplace = {
  "84532": {
    TransferManager: deployments_marketplace_base_sepolia.TransferManager.address,
    HypercertExchange: deployments_marketplace_base_sepolia.HypercertExchange.address,
    OrderValidatorV2A: deployments_marketplace_base_sepolia.OrderValidator.address,
    RoyaltyFeeRegistry: deployments_marketplace_base_sepolia.RoyaltyFeeRegistry.address,
    StrategyHypercertFractionOffer: deployments_marketplace_base_sepolia.StrategyHypercertFractionOffer.address,
  },
  "11155111": {
    TransferManager: deployments_marketplace_sepolia.TransferManager.address,
    HypercertExchange: deployments_marketplace_sepolia.HypercertExchange.address,
    OrderValidatorV2A: deployments_marketplace_sepolia.OrderValidator.address,
    RoyaltyFeeRegistry: deployments_marketplace_sepolia.RoyaltyFeeRegistry.address,
    StrategyHypercertFractionOffer: deployments_marketplace_sepolia.StrategyHypercertFractionOffer.address,
  },
};

export default { marketplace: deployments_marketplace, protocol: deployments_protocol };
