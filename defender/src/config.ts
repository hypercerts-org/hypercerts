import { NETWORKS, SupportedNetworks } from "./networks";
import * as dotenv from "dotenv";

dotenv.config();

const requireEnv = (value: string | undefined, identifier: string) => {
  if (!value) {
    throw new Error(`Required env var ${identifier} does not exist`);
  }
  return value;
};

interface Config {
  networks: SupportedNetworks;
  credentials: {
    apiKey: string;
    apiSecret: string;
  };
}

const config: Config = {
  networks: NETWORKS,
  credentials: {
    apiKey: requireEnv(
      process.env.OPENZEPPELIN_DEFENDER_ADMIN_API_KEY,
      "OPENZEPPELIN_DEFENDER_ADMIN_API_KEY",
    ),
    apiSecret: requireEnv(
      process.env.OPENZEPPELIN_DEFENDER_ADMIN_API_SECRET,
      "OPENZEPPELIN_DEFENDER_ADMIN_API_SECRET",
    ),
  },
};
export default config;
