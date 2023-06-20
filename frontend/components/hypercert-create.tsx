import { useAccountLowerCase } from "../hooks/account";
import { DEFAULT_CHAIN_ID } from "../lib/config";
import { parseListFromString } from "../lib/parsing";
import { useConfetti } from "./confetti";
import { useContractModal } from "./contract-interaction-dialog-context";
import { DATE_INDEFINITE, DateIndefinite, FormContext } from "./forms";
import { formatHypercertData } from "@hypercerts-org/sdk";
import { DataProvider } from "@plasmicapp/loader-nextjs";
import dayjs from "dayjs";
import { Formik, FormikProps } from "formik";
import html2canvas from "html2canvas";
import _ from "lodash";
import { useRouter } from "next/router";
import qs from "qs";
import React, { ReactNode } from "react";
import { toast } from "react-toastify";
import { useBalance, useNetwork } from "wagmi";
import * as Yup from "yup";
import { useMintClaim } from "../hooks/mintClaim";
import {
  useMintClaimAllowlist,
  DEFAULT_ALLOWLIST_PERCENTAGE,
} from "../hooks/mintClaimAllowlist";
import { useHypercertClient } from "../hooks/hypercerts-client";

/**
 * Constants
 */
const FORM_SELECTOR = "currentForm";
const IMAGE_SELECTOR = "hypercertimage";
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 50;

export const DESCRIPTION_MIN_LENGTH = 20;
export const DESCRIPTION_MAX_LENGTH = 1500;

export const DEFAULT_NUM_FRACTIONS = 10000;
export const DEFAULT_HYPERCERT_VERSION = "0.0.1";

//const DEFAULT_TIME = dayjs().format("YYYY-MM-DD");
const DEFAULT_TIME = dayjs();
const DEFAULT_FORM_DATA: HypercertCreateFormData = {
  name: "",
  description: "",
  externalLink: "",
  logoUrl: "",
  //logoImage: null,
  bannerUrl: "",
  //bannerImage: null,
  impactScopes: ["all"] as string[],
  //impactTimeStart: DEFAULT_TIME.format("YYYY-MM-DD"),
  impactTimeEnd: DEFAULT_TIME.format("YYYY-MM-DD"),
  workScopes: "",
  workTimeStart: DEFAULT_TIME.format("YYYY-MM-DD"),
  workTimeEnd: DEFAULT_TIME.format("YYYY-MM-DD"),
  rights: ["Public Display"] as string[],
  contributors: "",
  allowlistUrl: "",
  allowlistPercentage: DEFAULT_ALLOWLIST_PERCENTAGE,
  agreeContributorsConsent: false,
  agreeTermsConditions: false,
  // Hidden
  backgroundColor: "",
  backgroundVectorArt: "",
  metadataProperties: "",
};

interface HypercertCreateFormData {
  name: string;
  description: string;
  externalLink: string;
  logoUrl: string;
  //logoImage: File | null;
  bannerUrl: string;
  //bannerImage: File | null;
  impactScopes: string[];
  //impactTimeStart?: string;
  impactTimeEnd?: string | DateIndefinite;
  workScopes: string;
  workTimeStart?: string;
  workTimeEnd?: string;
  rights: string[];
  contributors: string;
  allowlistUrl: string;
  allowlistPercentage: number;
  agreeContributorsConsent: boolean;
  agreeTermsConditions: boolean;
  // Hidden
  backgroundColor: string;
  backgroundVectorArt: string;
  metadataProperties: string;
}

/**
 * Generic utility function to check for valid URLs
 * - We should probably move this to common.ts or util.ts
 * @param value
 * @param opts
 * @returns
 */
const isValidUrl = (
  value: any,
  opts: {
    emptyAllowed?: boolean;
    ipfsAllowed?: boolean;
  },
) => {
  // Check empty, null, or undefined
  if (opts.emptyAllowed && !value) {
    return true;
  } else if (!value) {
    return false;
  }

  // Check IPFS
  const isIpfsUrl = value.match(/^(ipfs):\/\//);
  if (opts.ipfsAllowed && isIpfsUrl) {
    return true;
  }

  try {
    const urlSchema = Yup.string().url();
    urlSchema.validateSync(value);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Converts raw form data to a query string
 * @param values
 * @returns
 */
const formDataToQueryString = (values: Record<string, any>) => {
  // We will serialize our Dayjs objects
  const formatDate = (key: string) => {
    if (values[key] === DATE_INDEFINITE) {
      values[key] = DATE_INDEFINITE;
    } else if (values[key] && values[key].format) {
      values[key] = values[key].format("YYYY-MM-DD");
    }
  };
  ["impactTimeStart", "impactTimeEnd", "workTimeStart", "workTimeEnd"].forEach(
    formatDate,
  );
  const filteredValues = _.chain(values).pickBy().value();
  return qs.stringify(filteredValues);
};

/**
 * Converts a query string into raw form data
 * @param query
 * @returns
 */
const queryStringToFormData = (query?: string) => {
  const rawValues = qs.parse(query ?? "");
  const parseValue = (v: any) => {
    return v === DATE_INDEFINITE ? DATE_INDEFINITE : dayjs(v as string);
  };
  const values = {
    ...rawValues,
    // we need to parse dates to match the expected types
    //impactTimeStart: parseValue(rawValues["impactTimeStart"]),
    impactTimeEnd: parseValue(rawValues["impactTimeEnd"]),
    workTimeStart: parseValue(rawValues["workTimeStart"]),
    workTimeEnd: parseValue(rawValues["workTimeEnd"]),
  };
  return values as any;
};

/**
 * Form validation rules
 */
const ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(NAME_MIN_LENGTH, `Name must be at least ${NAME_MIN_LENGTH} characters`)
    .max(NAME_MAX_LENGTH, `Name must be at most ${NAME_MAX_LENGTH} characters`)
    .required("Required"),
  description: Yup.string()
    .min(
      DESCRIPTION_MIN_LENGTH,
      `Description must be at least ${DESCRIPTION_MIN_LENGTH} characters`,
    )
    .max(
      DESCRIPTION_MAX_LENGTH,
      `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters`,
    )
    .required("Required"),
  externalLink: Yup.string().test(
    "valid uri",
    "Please enter a valid URL",
    (value) =>
      isValidUrl(value, {
        emptyAllowed: true,
        ipfsAllowed: true,
      }),
  ),
  logoUrl: Yup.string().test("valid uri", "Please enter a valid URL", (value) =>
    isValidUrl(value, {
      emptyAllowed: true,
      ipfsAllowed: false,
    }),
  ),
  bannerUrl: Yup.string().test(
    "valid uri",
    "Please enter a valid URL",
    (value) =>
      isValidUrl(value, {
        emptyAllowed: true,
        ipfsAllowed: false,
      }),
  ),
  impactScopes: Yup.array().min(1, "Please choose at least 1 item"),
  impactTimeEnd: Yup.lazy((val: any) => {
    switch (typeof val) {
      case "string":
        return Yup.string();
      default:
        return Yup.date().when("workTimeStart", (workTimeStart) => {
          return Yup.date().min(
            workTimeStart,
            "End date must be after start date",
          );
        });
    }
  }),
  workScopes: Yup.string()
    .required("Required")
    .min(
      NAME_MIN_LENGTH,
      `Work scopes must be at least ${NAME_MIN_LENGTH} characters`,
    )
    .test("no duplicates", "Please remove duplicate items", (value) => {
      if (!value) {
        return true;
      }
      const items = parseListFromString(value, { lowercase: "all" });
      const dedup = parseListFromString(value, {
        lowercase: "all",
        deduplicate: true,
      });
      return _.isEqual(items, dedup);
    }),
  workTimeEnd: Yup.date().when("workTimeStart", (workTimeStart) => {
    return Yup.date().min(workTimeStart, "End date must be after start date");
  }),
  rights: Yup.array().min(1),
  contributors: Yup.string()
    .required("Required")
    .test("no duplicates", "Please remove duplicate items", (value) => {
      if (!value) {
        return true;
      }
      const items = parseListFromString(value, { lowercase: "all" });
      const dedup = parseListFromString(value, {
        lowercase: "all",
        deduplicate: true,
      });
      return _.isEqual(items, dedup);
    }),
  allowlistUrl: Yup.string().test(
    "valid uri",
    "Please enter a valid URL",
    (value) =>
      isValidUrl(value, {
        emptyAllowed: true,
        ipfsAllowed: false,
      }),
  ),
  allowlistPerentage: Yup.number().min(1).max(100),
  agreeContributorsConsent: Yup.boolean().oneOf(
    [true],
    "You must get the consent of contributors before creating",
  ),
  agreeTermsConditions: Yup.boolean().oneOf(
    [true],
    "You must agree to the terms and conditions",
  ),
});

/**
 * Hypercert creation form logic using Formik
 * - For the actual layout of form elements,
 *   we assume it's passed in via the `children` prop.
 * - Use the form elements defined in `./forms.tsx`
 * - Make sure that there is a form element with a `fieldName`
 *   for each field in HypercertCreateFormData
 */
export interface HypercertCreateFormProps {
  className?: string; // Plasmic CSS class
  children?: ReactNode; // Form elements
}

export function HypercertCreateForm(props: HypercertCreateFormProps) {
  const { className, children } = props;
  const { address } = useAccountLowerCase();
  const { chain } = useNetwork();
  const { push } = useRouter();
  const { hideModal } = useContractModal();
  const confetti = useConfetti();
  const { client } = useHypercertClient();
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address as `0x${string}`,
  });

  // Query string
  const [initialQuery, setInitialQuery] = React.useState<string | undefined>(
    undefined,
  );
  // Load the querystring into React state only once on initial page load
  React.useEffect(() => {
    if (!initialQuery) {
      window.location.hash.startsWith("#")
        ? setInitialQuery(window.location.hash.slice(1))
        : setInitialQuery(window.location.hash);
    }
  }, [initialQuery]);

  const onComplete = async () => {
    hideModal();
    confetti &&
      (await confetti.addConfetti({
        emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸"],
      }));
    push("/app/dashboard");
  };

  const { write: mintClaim } = useMintClaim({
    onComplete,
  });

  const { write: mintClaimAllowlist } = useMintClaimAllowlist({
    onComplete,
  });

  return (
    <div className={className}>
      <Formik
        validationSchema={ValidationSchema}
        validateOnMount={true}
        validate={(_values) => {
          // console.log(values);
          if (typeof initialQuery !== "undefined") {
            // The useEffect has run already, so it's safe to just update the query string directly
            //const querystring = formDataToQueryString(values);
            //const path = `${window.location.pathname}#${querystring}`;
            //window.history.pushState(null, "", path);
          }
        }}
        initialValues={{
          ...DEFAULT_FORM_DATA,
          ...queryStringToFormData(initialQuery),
        }}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          if (!balanceLoading && balance && balance.value.isZero()) {
            console.log("No balance");
            toast(`No balance found for wallet ${address}`, { type: "error" });
            return;
          }
          if (!address) {
            console.log("User not connected");
            toast("Please connect your wallet", { type: "error" });
            return;
          } else if (chain?.id !== DEFAULT_CHAIN_ID) {
            console.log(
              `On wrong network. Expect ${DEFAULT_CHAIN_ID} Saw ${chain?.id}`,
            );
            toast("Please connect to the correct network first.", {
              type: "error",
            });
            return;
          } else if (!client || client.readonly) {
            toast("Client is in readonly mode. Are you connected?", {
              type: "warning",
            });
            return;
          }

          const image = await exportAsImage(IMAGE_SELECTOR);

          if (!image) {
            setSubmitting(false);
            return;
          }

          const metaData = formatValuesToMetaData(
            values,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            address!,
            image,
          );
          console.log(`Metadata(valid=${metaData.valid}): `, metaData.data);
          if (metaData.data) {
            //return; // Used for testing
            if (values.allowlistUrl) {
              await mintClaimAllowlist({
                metaData: metaData.data,
                allowlistUrl: values.allowlistUrl,
                allowlistPercentage: values.allowlistPercentage,
              });
            } else {
              await mintClaim(metaData.data, DEFAULT_NUM_FRACTIONS);
            }
          } else {
            toast("Error creating hypercert. Please contact the team.", {
              type: "error",
            });
            console.error("SDK formatting errors: ", metaData.errors);
          }
          setSubmitting(false);
        }}
      >
        {(formikProps: FormikProps<HypercertCreateFormData>) => (
          <DataProvider
            name={FORM_SELECTOR}
            data={{
              ...formikProps.values,
              shareUrl: `${window.location.pathname}#${formDataToQueryString(
                formikProps.values,
              )}`,
              isSubmitting: formikProps.isSubmitting,
            }}
          >
            <FormContext.Provider value={formikProps}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Submitting form...");
                  console.log("Form values: ", formikProps.values);
                  console.log("Form errors: ", formikProps.errors);
                  formikProps.handleSubmit();
                }}
              >
                {children}
              </form>
            </FormContext.Provider>
          </DataProvider>
        )}
      </Formik>
    </div>
  );
}

const formatValuesToMetaData = (
  val: HypercertCreateFormData,
  address: string,
  image?: string,
) => {
  // Split contributor names and addresses.
  // - make sure addresses are always lower case
  const contributorNamesAndAddresses = parseListFromString(val.contributors, {
    lowercase: "addresses",
  });
  // Split the work scopes
  const workScopes = parseListFromString(val.workScopes);

  // Mint certificate using contract
  // NOTE: we set the times to be UNIX time (seconds since the epoch)
  //  but Date.getTime() returns milliseconds since the epoch
  // NOTE: we are fixing the impactTimeStart to be the same as workTimeStart
  const impactTimeframeStart = val.workTimeStart
    ? new Date(val.workTimeStart).getTime() / 1000
    : 0;
  /**
  const impactTimeframeStart = val.impactTimeStart
    ? new Date(val.impactTimeStart).getTime() / 1000
    : 0;
  */
  const impactTimeframeEnd =
    val.impactTimeEnd !== "indefinite" && val.impactTimeEnd !== undefined
      ? new Date(val.impactTimeEnd).getTime() / 1000
      : 0;
  const workTimeframeStart = val.workTimeStart
    ? new Date(val.workTimeStart).getTime() / 1000
    : 0;
  const workTimeframeEnd = val.workTimeEnd
    ? new Date(val.workTimeEnd).getTime() / 1000
    : 0;

  let properties = [];
  if (val.metadataProperties) {
    try {
      properties = JSON.parse(val.metadataProperties);
    } catch (e) {
      console.warn(
        `Unable to parse metadataProperties: ${val.metadataProperties}`,
      );
    }
  }

  return formatHypercertData({
    name: val.name,
    description: val.description,
    external_url: val.externalLink,
    image: image ?? "",
    contributors: contributorNamesAndAddresses,
    workTimeframeStart,
    workTimeframeEnd,
    impactTimeframeStart,
    impactTimeframeEnd,
    workScope: workScopes,
    impactScope: val.impactScopes,
    rights: val.rights,
    version: DEFAULT_HYPERCERT_VERSION,
    properties: properties,
    excludedImpactScope: [],
    excludedRights: [],
    excludedWorkScope: [],
  });
};

const exportAsImage = async (id: string) => {
  const el = document.getElementById(id);
  if (!el) {
    return;
  }
  const canvas = await html2canvas(el, {
    logging: true,
    backgroundColor: null,
    //useCORS: true,
    proxy: "https://cors-proxy.hypercerts.workers.dev/",
    imageTimeout: 0,
  }).catch((e) => {
    toast("Error loading hypercert image . Please contact the team.", {
      type: "error",
    });
    console.error("Error exporting image: ", e);
    return undefined;
  });

  if (!canvas) {
    return undefined;
  }

  const image = canvas.toDataURL("image/png", 1.0);
  return image;
};
