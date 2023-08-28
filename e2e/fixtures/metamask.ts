import { test as base, chromium, type BrowserContext } from "@playwright/test";
import { initialSetup } from "@synthetixio/synpress/commands/metamask";
import { prepareMetamask } from "@synthetixio/synpress/helpers";
import {
  FRONTEND_HOST,
  FRONTEND_PORT,
  FRONTEND_RPC_HOST,
  FRONTEND_RPC_PORT,
} from "../utils/constants";

export const test = base.extend<{
  context: BrowserContext;
}>({
  // eslint-disable-next-line
  context: async ({}, use) => {
    // required for synpress
    global.expect = expect;
    // download metamask
    const metamaskPath = await prepareMetamask(
      process.env.METAMASK_VERSION || "10.25.0",
    );
    // prepare browser args
    const browserArgs = [
      `--disable-extensions-except=${metamaskPath}`,
      `--load-extension=${metamaskPath}`,
      "--remote-debugging-port=9222",
    ];
    if (process.env.CI) {
      browserArgs.push("--disable-gpu");
    }
    if (process.env.HEADLESS_MODE) {
      browserArgs.push("--headless=new");
    }
    // launch browser
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: browserArgs,
      baseURL: `http://${FRONTEND_HOST}:${FRONTEND_PORT}`,
    });
    // wait for metamask
    await context.pages()[0].waitForTimeout(10000);

    // setup metamask
    await initialSetup(chromium, {
      secretWordsOrPrivateKey:
        "test test test test test test test test test test test junk",
      network: {
        name: "hardhat",
        chainId: 31337,
        rpcUrl: `http://${FRONTEND_RPC_HOST}:${FRONTEND_RPC_PORT}`,
        symbol: "TEST",
        isTestnet: true,
      },
      password: "Tester@1234",
      enableAdvancedSettings: true,
      enableExperimentalSettings: false,
    });
    await use(context);
    await context.close();
  },
});
export const expect = test.expect;
