import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import dynamic from "next/dynamic";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from '@mui/material/Tooltip';
import { ClientGrid } from "./components/client-grid";
import { DEFAULT_TEST_DATA } from "./components/dapp-context";
import { HypercertCreateForm } from "./components/hypercert-create";
import {
  FormField,
  FormError,
  FormTextField,
  FormSelect,
  FormDatePicker,
  FormDropZone,
  FormCheckbox,
} from "./components/forms";
import { PLASMIC_PROJECT_ID, PLASMIC_PROJECT_API_TOKEN } from "./lib/config";
import { HypercertFetcher } from "./components/hypercert-fetcher";
import { SupabaseQuery } from "./components/supabase-query";
import ClaimAllFractionsButton from "./components/claim-all-fractions-button";

export const PLASMIC = initPlasmicLoader({
  projects: [
    // Hypercerts DApp
    {
      id: PLASMIC_PROJECT_ID,
      token: PLASMIC_PROJECT_API_TOKEN,
    },
  ],
  // Fetches the latest revisions, whether or not they were unpublished!
  // Disable for production to ensure you render only published changes.
  preview: false,
});

/**
 * Plasmic component registration
 * 
 * For more details see:
 * https://docs.plasmic.app/learn/code-components-ref/
 */

PLASMIC.registerComponent(ClientGrid, {
  name: "ClientGrid",
  description: "Calls a client method and shows the results",
  props: {
    method: {
      type: "choice",
      defaultValue: "getRounds",
      options: ["getRounds"],
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
    testLoading: {
      type: "boolean",
      editOnly: true,
    },
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

PLASMIC.registerComponent(
  dynamic(() => import("./components/dapp-context"), { ssr: false }),
  {
    name: "DappContext",
    description: "This must wrap anything that uses wallet functionality",
    props: {
      children: {
        type: "slot",
        defaultValue: {
          type: "text",
          value: "Placeholder",
        },
      },
      notConnected: {
        type: "slot",
        defaultValue: {
          type: "text",
          value: "Placeholder",
        },
      },
      showIfNotConnected: "boolean",
      testData: {
        type: "object",
        defaultValue: DEFAULT_TEST_DATA,
        editOnly: true,
      },
      useTestData: {
        type: "boolean",
        editOnly: true,
      },
    },
    providesData: true,
    importPath: "./components/dapp-context",
  },
);

PLASMIC.registerComponent(
  dynamic(() => import("./components/connect-wallet"), { ssr: false }),
  {
    name: "ConnectWallet",
    description: "The connect wallet button",
    props: {},
    importPath: "./components/connect-wallet",
  },
);

PLASMIC.registerComponent(HypercertFetcher, {
  name: "HypercertFetcher",
  description: "Client-side fetch metadata from IPFS",
  props: {
    children: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Placeholder",
      },
    },
    loading: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Placeholder",
      },
    },
    ignoreLoading: "boolean",
    useQueryString: "boolean",
    byClaimId: "string",
    byMetadataUri: "string",
  },
  providesData: true,
  importPath: "./components/hypercert-metadata-fetcher",
});

PLASMIC.registerComponent(HypercertCreateForm, {
  name: "HypercertCreateForm",
  description: "Create a hypercert",
  props: {
    children: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Placeholder",
      },
    },
  },
  providesData: true,
  importPath: "./components/hypercert-create",
});

PLASMIC.registerComponent(FormError, {
  name: "FormError",
  description: "Displays the error associated with fieldName",
  props: {
    fieldName: "string",
  },
  importPath: "./components/forms",
});

PLASMIC.registerComponent(FormField, {
  name: "FormField",
  description: "General purpose form field that accepts an arbitrary input",
  props: {
    fieldName: "string",
    children: "slot",
  },
  importPath: "./components/forms",
});

PLASMIC.registerComponent(FormTextField, {
  name: "FormTextField",
  description: "Textfield for forms",
  props: {
    fieldName: "string",
    label: "string",
    placeholder: "string",
    rows: "number",
  },
  importPath: "./components/forms",
});

PLASMIC.registerComponent(FormSelect, {
  name: "FormSelect",
  description: "Select box for forms",
  props: {
    fieldName: "string",
    label: "string",
    optionValues: {
      type: "object",
      defaultValue: ["a", "b"],
    },
    multiple: "boolean",
    disabled: "boolean",
  },
  importPath: "./components/forms",
});

PLASMIC.registerComponent(FormDatePicker, {
  name: "FormDatePicker",
  description: "Date picker for forms",
  props: {
    fieldName: "string",
    label: "string",
    showUndefined: "boolean",
    defaultUndefined: "boolean",
    disabled: "boolean",
  },
  importPath: "./components/forms",
});

PLASMIC.registerComponent(FormDropZone, {
  name: "FormDropZone",
  description: "DropZone for forms",
  props: {
    fieldName: "string",
    children: "slot",
    accept: "string",
  },
  importPath: "./components/forms",
});

PLASMIC.registerComponent(FormCheckbox, {
  name: "FormCheckbox",
  description: "Checkbox for forms",
  props: {
    fieldName: "string",
    defaultChecked: "boolean",
    disabled: "boolean",
  },
  importPath: "./components/forms",
});

PLASMIC.registerComponent(Tooltip, {
  name: "Tooltip",
  props: {
    title: "string"
  },
  importPath: "@mui/material/Tooltip",
});

PLASMIC.registerComponent(CircularProgress, {
  name: "CircularProgress",
  description: "Circular loading widget",
  props: {},
  importPath: "@mui/material/CircularProgress",
});

PLASMIC.registerComponent(SupabaseQuery, {
  name: "SupabaseQuery",
  props: {
    children: "slot",
    tableName: "string",
    columns: "string",
    filters: {
      type: "object",
      defaultValue: [],
    },
  },
  providesData: true,
  importPath: "./components/supabase-query",
});

PLASMIC.registerComponent(ClaimAllFractionsButton, {
  name: "ClaimAllFractionsButton",
  description: "Button that will claim all fractions upon clicking",
  props: {
    text: "string",
    className: "string",
  },
  importPath: "./components/claim-all-fractions-button",
});
