import { DataProvider } from "@plasmicapp/loader-nextjs";
import { Formik, FormikProps } from "formik";
import _ from "lodash";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { toast } from "react-toastify";
import {
  useBalance,
  useNetwork,
  usePrepareSendTransaction,
  useSendTransaction,
} from "wagmi";
import { BigNumber, utils } from "ethers";
import * as Yup from "yup";
import { useAccountLowerCase } from "../hooks/account";
import { useConfetti } from "./confetti";
import { FormContext } from "./forms";
import { supabase } from "../lib/supabase-client";

/**
 * Constants
 */
const FORM_SELECTOR = "currentForm";
const DESTINATION_ADDRESS = "zuzalu.eth";
export const CHAIN_ID = 1;
const ETH_PRICE = 1847.79;
export const MIN_PERCENTAGE = 0;
export const MAX_PERCENTAGE = 100;

// In USD
const pricePerPercent: ZuzaluPurchaseFormData = {
  percentBuyingZuzalu001: 200,
  percentBuyingZuzalu002: 100,
  percentBuyingZuzalu003: 400,
  percentBuyingZuzalu004: 400,
  percentBuyingZuzalu005: 300,
  percentBuyingZuzalu006: 200,
  percentBuyingZuzalu007: 100,
  percentBuyingZuzalu008: 400,
  percentBuyingZuzalu009: 50,
  percentBuyingZuzalu010: 50,
  percentBuyingZuzalu011: 150,
  percentBuyingZuzalu012: 150,
  percentBuyingZuzalu013: 150,
  percentBuyingZuzalu014: 150,
  percentBuyingZuzalu015: 150,
  percentBuyingZuzalu016: 150,
  percentBuyingZuzalu017: 150,
  percentBuyingZuzalu018: 150,
  percentBuyingZuzalu019: 150,
  percentBuyingZuzalu020: 150,
  percentBuyingZuzalu021: 150,
  percentBuyingZuzalu022: 150,
};

const DEFAULT_FORM_DATA: ZuzaluPurchaseFormData = {
  percentBuyingZuzalu001: 0,
  percentBuyingZuzalu002: 0,
  percentBuyingZuzalu003: 0,
  percentBuyingZuzalu004: 0,
  percentBuyingZuzalu005: 0,
  percentBuyingZuzalu006: 0,
  percentBuyingZuzalu007: 0,
  percentBuyingZuzalu008: 0,
  percentBuyingZuzalu009: 0,
  percentBuyingZuzalu010: 0,
  percentBuyingZuzalu011: 0,
  percentBuyingZuzalu012: 0,
  percentBuyingZuzalu013: 0,
  percentBuyingZuzalu014: 0,
  percentBuyingZuzalu015: 0,
  percentBuyingZuzalu016: 0,
  percentBuyingZuzalu017: 0,
  percentBuyingZuzalu018: 0,
  percentBuyingZuzalu019: 0,
  percentBuyingZuzalu020: 0,
  percentBuyingZuzalu021: 0,
  percentBuyingZuzalu022: 0,
};

interface ZuzaluPurchaseFormData {
  percentBuyingZuzalu001: number | string;
  percentBuyingZuzalu002: number | string;
  percentBuyingZuzalu003: number | string;
  percentBuyingZuzalu004: number | string;
  percentBuyingZuzalu005: number | string;
  percentBuyingZuzalu006: number | string;
  percentBuyingZuzalu007: number | string;
  percentBuyingZuzalu008: number | string;
  percentBuyingZuzalu009: number | string;
  percentBuyingZuzalu010: number | string;
  percentBuyingZuzalu011: number | string;
  percentBuyingZuzalu012: number | string;
  percentBuyingZuzalu013: number | string;
  percentBuyingZuzalu014: number | string;
  percentBuyingZuzalu015: number | string;
  percentBuyingZuzalu016: number | string;
  percentBuyingZuzalu017: number | string;
  percentBuyingZuzalu018: number | string;
  percentBuyingZuzalu019: number | string;
  percentBuyingZuzalu020: number | string;
  percentBuyingZuzalu021: number | string;
  percentBuyingZuzalu022: number | string;
}

/**
 * Generic utility function to check for valid percentage
 * @param value
 * @returns boolean
 */
const isValidPercentage = (value: any): boolean => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return false;
  } else if (num > MAX_PERCENTAGE) {
    return false;
  } else if (num < MIN_PERCENTAGE) {
    return false;
  } else {
    return true;
  }
};

/**
 * Form validation rules
 */
const PercentageSchema = Yup.string().test(
  "valid percentage",
  `Please enter a valid percentage from ${MIN_PERCENTAGE} to ${MAX_PERCENTAGE}`,
  (value) => isValidPercentage(value),
);
const ValidationSchema = Yup.object().shape({
  percentBuyingZuzalu001: PercentageSchema,
  percentBuyingZuzalu002: PercentageSchema,
  percentBuyingZuzalu003: PercentageSchema,
  percentBuyingZuzalu004: PercentageSchema,
  percentBuyingZuzalu005: PercentageSchema,
  percentBuyingZuzalu006: PercentageSchema,
  percentBuyingZuzalu007: PercentageSchema,
  percentBuyingZuzalu008: PercentageSchema,
  percentBuyingZuzalu009: PercentageSchema,
  percentBuyingZuzalu010: PercentageSchema,
  percentBuyingZuzalu011: PercentageSchema,
  percentBuyingZuzalu012: PercentageSchema,
  percentBuyingZuzalu013: PercentageSchema,
  percentBuyingZuzalu014: PercentageSchema,
  percentBuyingZuzalu015: PercentageSchema,
  percentBuyingZuzalu016: PercentageSchema,
  percentBuyingZuzalu017: PercentageSchema,
  percentBuyingZuzalu018: PercentageSchema,
  percentBuyingZuzalu019: PercentageSchema,
  percentBuyingZuzalu020: PercentageSchema,
  percentBuyingZuzalu021: PercentageSchema,
  percentBuyingZuzalu022: PercentageSchema,
});

export interface ZuzaluPurchaseFormProps {
  className?: string; // Plasmic CSS class
  children?: ReactNode; // Form elements
}

export function ZuzaluPurchaseForm(props: ZuzaluPurchaseFormProps) {
  const { className, children } = props;
  const { address } = useAccountLowerCase();
  const { chain } = useNetwork();
  const { push } = useRouter();
  const confetti = useConfetti();
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address as `0x${string}`,
  });
  const [value, setValue] = React.useState<BigNumber | undefined>();
  const [wagmiErr, setWagmiErr] = React.useState<Error | undefined>();
  const { config } = usePrepareSendTransaction({
    request: {
      to: DESTINATION_ADDRESS,
      value,
    },
    onError(error) {
      setWagmiErr(error);
    },
  });
  const { sendTransaction } = useSendTransaction({
    ...config,
    onError(error) {
      setWagmiErr(error);
    },
  });

  return (
    <div className={className}>
      <Formik
        validationSchema={ValidationSchema}
        validateOnMount={true}
        validate={(values) => {
          // console.log(values);
          const parsedValues = _.mapValues(values, (v: string | number) =>
            typeof v == "string" ? parseFloat(v) : v,
          );
          const cleanedValues = _.mapValues(parsedValues, (v: number) =>
            isNaN(v) ? 0 : v,
          );
          const valuesInDollars = _.mergeWith(
            cleanedValues,
            pricePerPercent,
            (percent, price) => percent * price,
          );
          const dollarArray = _.values(valuesInDollars);
          const totalUSD = _.sum(dollarArray);
          const totalETH = totalUSD / ETH_PRICE;
          const totalWei = utils.parseEther(`${totalETH}`);
          setValue(totalWei);
        }}
        initialValues={{ ...DEFAULT_FORM_DATA }}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          // Check for errors
          if (!address) {
            console.warn("User not connected");
            toast("Please connect your wallet", { type: "error" });
            return;
          } else if (chain?.id !== CHAIN_ID) {
            console.warn(
              `On wrong network. Expect ${CHAIN_ID} Saw ${chain?.id}`,
            );
            toast("Please switch to the Ethereum network.", {
              type: "error",
            });
            return;
          } else if (!balanceLoading && balance && balance.value.isZero()) {
            console.warn("No balance");
            toast(`No balance found for wallet ${address}`, { type: "error" });
            return;
          } else if (!value || value.isZero()) {
            console.warn("No values selected");
            toast(`Please select some hypercerts`, { type: "error" });
            return;
          }

          // Write to supabase
          const { error: supabaseError } = await supabase
            .from("zuzalu-purchase")
            .insert({
              address,
              values,
            });
          if (supabaseError) {
            console.error("Supabase error", supabaseError);
            toast(`Error writing to database`, { type: "error" });
            return;
          } else if (!sendTransaction) {
            console.error("Unable to send transaction: ", wagmiErr?.message);
            toast(wagmiErr?.message ?? "Unable to send transaction", {
              type: "error",
            });
            return;
          }

          await sendTransaction();

          confetti &&
            (await confetti.addConfetti({
              emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸"],
            }));
          setSubmitting(false);
          push("/app/zuzalu/confirm");
        }}
      >
        {(formikProps: FormikProps<ZuzaluPurchaseFormData>) => (
          <DataProvider
            name={FORM_SELECTOR}
            data={{
              ...formikProps.values,
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
