import dotenv from "dotenv";
import { startProxy } from "@viem/anvil";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

dotenv.config({ path: "./.env" });

const reloadEnv = () => {
  dotenv.config({ path: "./.env" });
};

export default async function () {
  return await startProxy({
    port: 8545, // By default, the proxy will listen on port 8545.
    host: "::", // By default, the proxy will listen on all interfaces.
  });
}

export { reloadEnv };
