import { test, expect } from "./fixtures/metamask";
import { Page } from "@playwright/test";
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { randomUUID } from "crypto";

async function connectWallet(goto: string, page: Page) {
  await page.goto(goto);
  await page.locator('button[data-testid="rk-connect-button"]').click();

  await page.locator('button[data-testid="rk-wallet-option-metaMask"]').click();
  await metamask.acceptAccess();
}

test.beforeEach(async ({ page }) => {
  // These are very large tests we should have a long timeout
  test.setTimeout(120000);
  page.setDefaultTimeout(60000);

  // await page.goto("http://127.0.0.1:3000/");
  // await page.reload();
  // await page.locator('button[data-testid="rk-connect-button"]').click();

  // await page.locator('button[data-testid="rk-wallet-option-metaMask"]').click();
  // await metamask.acceptAccess();
});

test("should succeed to mint a token", async ({ page }) => {
  const testUUID = randomUUID();
  const name = `Test:${testUUID}`;
  const description = "This is a description of the hypercert is referencing";
  const workScope = "Scope1, Scope2";
  const contributors = "Contrib1, Contrib2";

  // Clicking to navigate to the "/app/create" path caused problems.
  await connectWallet("http://127.0.0.1:3000/app/create", page);

  // Ensure the wallet button is properly loaded
  await expect(
    page.locator('button[data-testid="rk-account-button"]'),
  ).toBeAttached({ timeout: 5000 });

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

  await page.waitForURL("http://127.0.0.1:3000/app/dashboard");
  await expect(page.getByText(testUUID)).toBeAttached({ timeout: 60000 });
});

// test("should fail to mint a token - lacking description", async ({ page }) => {
//   const testUUID = randomUUID();
//   const name = `Test:${testUUID}`;
//   const description = "This is a description of the hypercert is referencing";
//   const workScope = "Scope1, Scope2";
//   const contributors = "";

//   await page.getByRole("link").filter({ hasText: "Create" }).click();
//   await page.locator('input[name="name"]').fill(name);
//   await page.locator('textarea[name="description"]').fill(description);
//   await page.locator('textarea[name="workScopes"]').fill(workScope);

//   await page.locator('textarea[name="contributors"]').fill(contributors);
//   await page.locator('input[name="agreeContributorsConsent"]').check();
//   await page.locator('input[name="agreeTermsConditions"]').check();
//   await page.locator('button[class*="HypercertsCreate__button"]').click();

//   await expect(page.locator('textarea[name="contributors"]')).toHaveAttribute(
//     "aria-invalid",
//     "true",
//   );
// });
