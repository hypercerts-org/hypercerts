import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import { getEnv } from "./lib/env";

const PLASMIC_PROJECT_ID = getEnv('PLASMIC_PROJECT_ID');
const PLASMIC_PROJECT_API_TOKEN = getEnv('PLASMIC_PROJECT_API_TOKEN');

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: PLASMIC_PROJECT_ID,
      token: PLASMIC_PROJECT_API_TOKEN,
    }
  ],
  // Fetches the latest revisions, whether or not they were unpublished!
  // Disable for production to ensure you render only published changes.
  preview: true,
})
