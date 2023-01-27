import * as dotenv from "dotenv";

dotenv.config();

export const apiKey = process.env.ADMIN_API_KEY;
export const apiSecret = process.env.ADMIN_API_SECRET;
export const contractAddress = process.env.CONTRACT_ADDRESS;
