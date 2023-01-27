import { SentinelClient } from "defender-sentinel-client";

const credentials = {
  apiKey: process.env.ADMIN_API_KEY,
  apiSecret: process.env.ADMIN_API_SECRET,
};

export const client = new SentinelClient(credentials);
