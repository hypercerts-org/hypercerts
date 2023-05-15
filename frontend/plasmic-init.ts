import ClaimAllFractionsButton from "./components/claim-all-fractions-button";
import { ClientGrid } from "./components/client-grid";
import { Config } from "./components/config";
import { DEFAULT_TEST_DATA } from "./components/dapp-context";
import {
  FormField,
  FormError,
  FormTextField,
  FormSelect,
  FormSlider,
  FormDatePicker,
  FormDropZone,
  FormCheckbox,
} from "./components/forms";
import { HypercertCreateForm } from "./components/hypercert-create";
import { HypercertFetcher } from "./components/hypercert-fetcher";
import { SupabaseQuery } from "./components/supabase-query";
import { SupabaseToChart } from "./components/supabase-to-chart";
import { Tooltip, Accordion, Markdown } from "./components/widgets";
import { PLASMIC_PROJECT_ID, PLASMIC_PROJECT_API_TOKEN } from "./lib/config";
import CircularProgress from "@mui/material/CircularProgress";
import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import dynamic from "next/dynamic";

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
  preview: true,
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

PLASMIC.registerComponent(Config, {
  name: "Config",
  description: "Expose app config",
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
  importPath: "./components/config",
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
      showIfNotConnected: {
        type: "boolean",
        helpText: "Display 'notConnected' if wallet not connected",
      },
      testData: {
        type: "object",
        defaultValue: DEFAULT_TEST_DATA,
        editOnly: true,
        helpText: "Test data to show in Studio",
      },
      useTestData: {
        type: "boolean",
        editOnly: true,
        helpText: "Toggle between using real and test data",
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
    variableName: {
      type: "string",
      helpText: "Name to use in Plasmic data picker",
    },
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
    ignoreLoading: {
      type: "boolean",
      helpText: "Don't show 'loading' even if we're still loading data",
    },
    useQueryString: {
      type: "boolean",
      helpText: "Retrieve claimId from URL hash querystring instead",
    },
    byClaimId: {
      type: "string",
      helpText: "Only set 1 of either byClaimId or byMetadataUri",
    },
    byMetadataUri: {
      type: "string",
      helpText:
        "Metadata URI of Hypercert to fetch. Returns faster than 'byClaimId'",
    },
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
    fieldName: {
      type: "string",
      helpText: "Formik field name",
    },
  },
  importPath: "./components/forms",
});

PLASMIC.registerComponent(FormField, {
  name: "FormField",
  description: "General purpose form field that accepts an arbitrary input",
  props: {
    fieldName: {
      type: "string",
      helpText: "Formik field name",
    },
    children: "slot",
  },
  importPath: "./components/forms",
});

PLASMIC.registerComponent(FormTextField, {
  name: "FormTextField",
  description: "Textfield for forms",
  props: {
    fieldName: {
      type: "string",
      helpText: "Formik field name",
    },
    disabled: "boolean",
    label: "string",
    placeholder: "string",
    multiline: {
      type: "boolean",
      helpText: "Support multiple lines. Automatically resizes the box",
    },
    minRows: {
      type: "number",
      helpText: "If multiline, minimum rows to show",
    },
    maxRows: {
      type: "number",
      helpText: "If multiline, maximum rows to show. Scrolls if more than that",
    },
    rows: {
      type: "number",
      helpText: "If multiline, fixes the number of rows to show",
    },
  },
  importPath: "./components/forms",
});

PLASMIC.registerComponent(FormSelect, {
  name: "FormSelect",
  description: "Select box for forms",
  props: {
    fieldName: {
      type: "string",
      helpText: "Formik field name",
    },
    label: "string",
    optionValues: {
      type: "object",
      defaultValue: ["a", "b"],
    },
    multiple: {
      type: "boolean",
      helpText: "Let the user choose multiple values",
    },
    disabled: "boolean",
  },
  importPath: "./components/forms",
});

PLASMIC.registerComponent(FormSlider, {
  name: "FormSlider",
  description: "Slider for forms",
  props: {
    fieldName: {
      type: "string",
      helpText: "Formik field name",
    },
    disabled: "boolean",
    defaultValue: {
      type: "number",
      helpText: "Starting value",
    },
    min: "number",
    max: "number",
    step: "number",
  },
  importPath: "./components/forms",
});

PLASMIC.registerComponent(FormDatePicker, {
  name: "FormDatePicker",
  description: "Date picker for forms",
  props: {
    fieldName: {
      type: "string",
      helpText: "Formik field name",
    },
    label: "string",
    showUndefined: {
      type: "boolean",
      helpText: "Show checkbox to allow setting to undefined",
    },
    defaultUndefined: "boolean",
    disabled: "boolean",
  },
  importPath: "./components/forms",
});

PLASMIC.registerComponent(FormDropZone, {
  name: "FormDropZone",
  description: "DropZone for forms",
  props: {
    fieldName: {
      type: "string",
      helpText: "Formik field name",
    },
    children: "slot",
    accept: {
      type: "string",
      helpText: "Types of files to accept",
    },
  },
  importPath: "./components/forms",
});

PLASMIC.registerComponent(FormCheckbox, {
  name: "FormCheckbox",
  description: "Checkbox for forms",
  props: {
    fieldName: {
      type: "string",
      helpText: "Formik field name",
    },
  },
  importPath: "./components/forms",
});

PLASMIC.registerComponent(Tooltip, {
  name: "Tooltip",
  props: {
    title: "string",
    children: "slot",
    fontSize: "number",
    color: {
      type: "string",
      helpText: "Font color",
    },
    backgroundColor: {
      type: "string",
      helpText: "Background color",
    },
  },
  importPath: "./components/widgets",
});

PLASMIC.registerComponent(Accordion, {
  name: "Accordion",
  props: {
    summary: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Placeholder",
      },
    },
    children: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Placeholder",
      },
    },
  },
  importPath: "./components/widgets",
});

PLASMIC.registerComponent(Markdown, {
  name: "Markdown",
  props: {
    markdown: {
      type: "string",
      helpText: "Copy and paste markdown here",
    },
  },
  importPath: "./components/widgets",
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
    variableName: {
      type: "string",
      helpText: "Name to use in Plasmic data picker",
    },
    children: "slot",
    loading: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Placeholder",
      },
    },
    ignoreLoading: {
      type: "boolean",
      helpText: "Don't show 'loading' even if we're still loading data",
    },
    tableName: {
      type: "string",
      helpText: "Supabase table name",
    },
    columns: {
      type: "string",
      helpText: "Comma-separated list of columns",
    },
    filters: {
      type: "object",
      defaultValue: [],
      helpText: "e.g. [['id', 'lt', 10], ['name', 'eq', 'foobar']]",
    },
    limit: {
      type: "number",
      helpText: "Number of rows to return",
    },
    orderBy: {
      type: "string",
      helpText: "Name of column to order by",
    },
    orderAscending: {
      type: "boolean",
      helpText: "True if ascending, false if descending",
    },
  },
  providesData: true,
  importPath: "./components/supabase-query",
});

PLASMIC.registerComponent(SupabaseToChart, {
  name: "SupabaseToChart",
  props: {
    variableName: {
      type: "string",
      helpText: "Name to use in Plasmic data picker",
    },
    children: "slot",
    loading: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Placeholder",
      },
    },
    ignoreLoading: {
      type: "boolean",
      helpText: "Don't show 'loading' even if we're still loading data",
    },
    githubOrgs: {
      type: "array",
      defaultValue: [],
      helpText: "List of GitHub orgs to compare",
    },
    eventTypes: {
      type: "array",
      defaultValue: [],
      helpText: "List of event types to display",
    },
    startDate: {
      type: "string",
      helpText: "e.g. 2022-04-01",
    },
    endDate: {
      type: "string",
      helpText: "e.g. 2022-04-01",
    },
  },
  providesData: true,
  importPath: "./components/supabase-to-chart",
});

PLASMIC.registerComponent(ClaimAllFractionsButton, {
  name: "ClaimAllFractionsButton",
  description: "Button that will claim all fractions upon clicking",
  props: {
    text: "string",
    disabled: "boolean",
  },
  importPath: "./components/claim-all-fractions-button",
});
