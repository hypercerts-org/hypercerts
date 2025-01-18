import deployments_marketplace_base_sepolia from "./deployment-marketplace-base-sepolia.json";
import deployments_marketplace_optimism_mainnet from "./deployment-marketplace-optimism-mainnet.json";
import deployments_marketplace_sepolia from "./deployment-marketplace-sepolia.json";
import deployments_protocol from "./deployments-protocol.json";
import deployments_marketplace_arb_sepolia from "./deployment-marketplace-arb-sepolia.json";
import deployments_marketplace_arb_one from "./deployment-marketplace-arbitrumOne.json";
import deployments_marketplace_celo_mainnet from "./deployment-marketplace-celo-mainnet.json";
const deployments_marketplace = {
  "10": {
    TransferManager: deployments_marketplace_optimism_mainnet.TransferManager.address,
    HypercertExchange: deployments_marketplace_optimism_mainnet.HypercertExchange.address,
    OrderValidatorV2A: deployments_marketplace_optimism_mainnet.OrderValidator.address,
    RoyaltyFeeRegistry: deployments_marketplace_optimism_mainnet.RoyaltyFeeRegistry.address,
    StrategyHypercertFractionOffer: deployments_marketplace_optimism_mainnet.StrategyHypercertFractionOffer.address,
  },
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
  "421614": {
    TransferManager: deployments_marketplace_arb_sepolia.TransferManager.address,
    HypercertExchange: deployments_marketplace_arb_sepolia.HypercertExchange.address,
    OrderValidatorV2A: deployments_marketplace_arb_sepolia.OrderValidator.address,
    RoyaltyFeeRegistry: deployments_marketplace_arb_sepolia.RoyaltyFeeRegistry.address,
    StrategyHypercertFractionOffer: deployments_marketplace_arb_sepolia.StrategyHypercertFractionOffer.address,
  },
  "42161": {
    TransferManager: deployments_marketplace_arb_one.TransferManager.address,
    HypercertExchange: deployments_marketplace_arb_one.HypercertExchange.address,
    OrderValidatorV2A: deployments_marketplace_arb_one.OrderValidator.address,
    RoyaltyFeeRegistry: deployments_marketplace_arb_one.RoyaltyFeeRegistry.address,
    StrategyHypercertFractionOffer: deployments_marketplace_arb_one.StrategyHypercertFractionOffer.address,
  },
  "42220": {
    TransferManager: deployments_marketplace_celo_mainnet.TransferManager.address,
    HypercertExchange: deployments_marketplace_celo_mainnet.HypercertExchange.address,
    OrderValidatorV2A: deployments_marketplace_celo_mainnet.OrderValidator.address,
    RoyaltyFeeRegistry: deployments_marketplace_celo_mainnet.RoyaltyFeeRegistry.address,
    StrategyHypercertFractionOffer: deployments_marketplace_celo_mainnet.StrategyHypercertFractionOffer.address,
  },
};

export default { marketplace: deployments_marketplace, protocol: deployments_protocol };
