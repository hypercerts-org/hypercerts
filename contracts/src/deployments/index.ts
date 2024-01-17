import deployments_marketplace_sepolia from "./deployment-marketplace-sepolia.json";
import deployments_protocol from "./deployments-protocol.json";

const deployments_marketplace = {
  "11155111": {
    TransferManager: deployments_marketplace_sepolia.TransferManager.address,
    HypercertExchange: deployments_marketplace_sepolia.HypercertExchange.address,
    OrderValidatorV2A: deployments_marketplace_sepolia.OrderValidator.address,
    RoyaltyFeeRegistry: deployments_marketplace_sepolia.RoyaltyFeeRegistry.address,
    StrategyCollectionOffer: deployments_marketplace_sepolia.StrategyCollectionOffer.address,
    StrategyDutchAuction: deployments_marketplace_sepolia.StrategyDutchAuction.address,
    StrategyItemIdsRange: deployments_marketplace_sepolia.StrategyItemIdsRange.address,
    StrategyHypercertCollectionOffer: deployments_marketplace_sepolia.StrategyHypercertCollectionOffer.address,
    StrategyHypercertDutchAuction: deployments_marketplace_sepolia.StrategyHypercertDutchAuction.address,
    StrategyHypercertFractionOffer: deployments_marketplace_sepolia.StrategyHypercertFractionOffer.address,
  },
};

export default { marketplace: deployments_marketplace, protocol: deployments_protocol };
