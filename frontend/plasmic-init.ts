import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import { ClientGrid } from "./components/client-grid";
import { HypercertCreateForm } from "./components/hypercert-create";
import { FormField, FormError, FormTextField, FormDatePicker, FormSelect } from "./components/forms";

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
  importPath: "./components/client-grid",
});

PLASMIC.registerComponent(HypercertCreateForm, {
  name: "HypercertCreateForm",
  props: {
    children: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Placeholder",
      },
    },
  },
  importPath: "./components/hypercert-create",
});

PLASMIC.registerComponent(FormError, {
  name: "FormError",
  props: {
    fieldName: "string",
  },
  importPath: "./components/forms",
});

PLASMIC.registerComponent(FormField, {
  name: "FormField",
  props: {
    fieldName: "string",
    children: "slot",
  },
  importPath: "./components/forms",
});

PLASMIC.registerComponent(FormTextField, {
  name: "FormTextField",
  props: {
    fieldName: "string",
    label: "string",
    placeholder: "string",
    multiline: "boolean",
  },
  importPath: "./components/forms",
});

PLASMIC.registerComponent(FormSelect, {
  name: "FormSelect",
  props: {
    fieldName: "string",
    label: "string",
    optionValues: {
      type: "object",
      defaultValue: ["a", "b"],
    },
    multiple: "boolean",
  },
  importPath: "./components/forms",
});

PLASMIC.registerComponent(FormDatePicker, {
  name: "FormDatePicker",
  props: {
    fieldName: "string",
    label: "string",
  },
  importPath: "./components/forms",
});

