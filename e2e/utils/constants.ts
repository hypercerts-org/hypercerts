import { Page } from "playwright-core";

export const FRONTEND_HOST = process.env.FRONTEND_HOST || "127.0.0.1";
export const FRONTEND_PORT = process.env.FRONTEND_PORT || "3000";
export const FRONTEND_RPC_HOST = process.env.FRONTEND_RPC_HOST || "127.0.0.1";
export const FRONTEND_RPC_PORT = process.env.FRONTEND_RPC_PORT || "8545";

export async function gotoPage(page: Page, path: string) {
  return await page.goto(fullUrl(path));
}

export function fullUrl(path: string) {
  return `http://${FRONTEND_HOST}:${FRONTEND_PORT}${path}`;
}
