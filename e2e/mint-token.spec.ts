import { test, expect } from "./fixtures/metamask";
import { Page } from "@playwright/test";
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { randomUUID } from "crypto";

async function navigateAndEnsureWallet(goto: string, page: Page) {
  await page.goto(goto);
  await expect(
    page.locator('button[data-testid="rk-account-button"]'),
  ).toBeAttached({ timeout: 5000 });
}

test.beforeEach(async ({ page }) => {
  // These are very large tests we should have a long timeout
  test.setTimeout(120000);
  page.setDefaultTimeout(60000);

  await page.goto("/");
  await page.reload();
  await page.locator('button[data-testid="rk-connect-button"]').click();
  await page.screenshot({ path: "debug1.png", fullPage: true });

  await page.locator('button[data-testid="rk-wallet-option-metaMask"]').click();
  await page.screenshot({ path: "debug2.png", fullPage: true });
  await metamask.acceptAccess();
});

test("should succeed to mint a token", async ({ page }) => {
  const testUUID = randomUUID();
  const name = `Test:${testUUID}`;
  const description = "This is a description of the hypercert is referencing";
  const workScope = "Scope1, Scope2";
  const contributors = "Contrib1, Contrib2";

  // Clicking to navigate to the "/app/create" path caused problems. For now,
  // ignore clicking on the links with the prefilled fields
  await navigateAndEnsureWallet("/app/create", page);

  await page.pause();

  // Fill in required fields
  await page.locator('input[name="name"]').fill(name);
  await page.locator('textarea[name="description"]').fill(description);
  await page.locator('textarea[name="workScopes"]').fill(workScope);
  await page.locator('textarea[name="contributors"]').fill(contributors);

  // Check boxes
  await page.locator('input[name="agreeContributorsConsent"]').check();
  await page.locator('input[name="agreeTermsConditions"]').check();
  await page.locator('button[class*="HypercertsCreate__button"]').click();
  await metamask.confirmTransaction();

  await page.waitForURL("/app/dashboard");
  await expect(page.getByText(testUUID)).toBeAttached({ timeout: 60000 });
});

test("should fail to mint a token - lacking description", async ({ page }) => {
  const testUUID = randomUUID();
  const name = `Test:${testUUID}`;
  const description = "This is a description of the hypercert is referencing";
  const workScope = "Scope1, Scope2";
  const contributors = "";

  await navigateAndEnsureWallet("/app/create", page);
  await page.locator('input[name="name"]').fill(name);
  await page.locator('textarea[name="description"]').fill(description);
  await page.locator('textarea[name="workScopes"]').fill(workScope);

  await page.locator('textarea[name="contributors"]').fill(contributors);
  await page.locator('input[name="agreeContributorsConsent"]').check();
  await page.locator('input[name="agreeTermsConditions"]').check();
  await page.locator('button[class*="HypercertsCreate__button"]').click();

  await expect(page.locator('textarea[name="contributors"]')).toHaveAttribute(
    "aria-invalid",
    "true",
  );
});
