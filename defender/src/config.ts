import * as dotenv from "dotenv";
dotenv.config();

export const requireEnv = (value: string | undefined, identifier: string) => {
  if (!value) {
    throw new Error(`Required env var ${identifier} does not exist`);
  }
  return value;
};

export const apiKey = requireEnv(
  process.env.OPENZEPPELIN_DEFENDER_ADMIN_API_KEY,
  "OPENZEPPELIN_DEFENDER_ADMIN_API_KEY",
);
export const apiSecret = requireEnv(
  process.env.OPENZEPPELIN_DEFENDER_ADMIN_API_SECRET,
  "OPENZEPPELIN_DEFENDER_ADMIN_API_SECRET",
);
export const contractAddress = requireEnv(
  process.env.CONTRACT_ADDRESS,
  "CONTRACT_ADDRESS",
);
