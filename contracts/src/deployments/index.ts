import deployments_marketplace_goerli from "./deployment-marketplace-goerli.json";
import deployments_marketplace_sepolia from "./deployment-marketplace-sepolia.json";
import deployments_protocol from "./deployments-protocol.json";

const deployments_marketplace = {
  "5": deployments_marketplace_goerli,
  "11155111": deployments_marketplace_sepolia,
};

export default { marketplace: deployments_marketplace, protocol: deployments_protocol };
