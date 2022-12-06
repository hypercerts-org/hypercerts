import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import { ClientGrid } from "./components/plasmic_code_components";

const PLASMIC_PROJECT_ID = process.env.PLASMIC_PROJECT_ID ?? "MISSING";
const PLASMIC_PROJECT_API_TOKEN = process.env.PLASMIC_PROJECT_API_TOKEN ?? "MISSING";

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

PLASMIC.registerComponent(ClientGrid, {
  name: "ClientGrid",
  props: {
    method: {
      type: "choice",
      defaultValue: "text",
      options: [ "getRounds" ],
    },
    children: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Placeholder",
      },
    },
    loadingChildren: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Loading...",
      },
    },
    forceLoading: "boolean",
    count: "number",
  },
  defaultStyles: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridRowGap: "30px",
    gridColumnGap: "50px",
    padding: "8px",
    maxWidth: "100%",
  },
  providesData: true,
  importPath: "./components/plasmic_code_components",
});