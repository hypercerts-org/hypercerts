import { test, expect } from "./fixtures/metamask";
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { randomUUID } from "crypto";

test.beforeEach(async ({ page }) => {
  // These are very large tests we should have a long timeout
  test.setTimeout(120000);
  page.setDefaultTimeout(60000);

  await page.goto("http://127.0.0.1:3000/");
  await page.reload();
  await page.locator('button[data-testid="rk-connect-button"]').click();

  await page.locator('button[data-testid="rk-wallet-option-metaMask"]').click();
  await metamask.acceptAccess();
});

test("should succeed to mint a token", async ({ page }) => {
  const testUUID = randomUUID();
  const name = `Test:${testUUID}`;
  const description = "This is a description of the hypercert is referencing";
  const workScope = "Scope1, Scope2";
  const contributors = "Contrib1, Contrib2";

  await page.getByRole("link").filter({ hasText: "Create" }).click();
  await page.locator('input[name="name"]').fill(name);
  await page.locator('textarea[name="description"]').fill(description);
  await page.locator('textarea[name="workScopes"]').fill(workScope);
  await page.locator('textarea[name="contributors"]').fill(contributors);
  await page.locator('input[name="agreeContributorsConsent"]').check();
  await page.locator('input[name="agreeTermsConditions"]').check();
  await page.locator('button[class*="HypercertsCreate__button"]').click();
  await metamask.confirmTransaction();

  await page.waitForURL("http://127.0.0.1:3000/app/dashboard");
  await expect(page.getByText(testUUID)).toBeAttached();
});

test("should fail to mint a token - lacking description", async ({ page }) => {
  const testUUID = randomUUID();
  const name = `Test:${testUUID}`;
  const description = "This is a description of the hypercert is referencing";
  const workScope = "Scope1, Scope2";
  const contributors = "";

  await page.getByRole("link").filter({ hasText: "Create" }).click();
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
