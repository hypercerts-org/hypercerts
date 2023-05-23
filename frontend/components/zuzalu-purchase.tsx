import { DataProvider } from "@plasmicapp/loader-nextjs";
import { Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { toast } from "react-toastify";
import { useBalance, useNetwork } from "wagmi";
import * as Yup from "yup";
import { useAccountLowerCase } from "../hooks/account";
import { useConfetti } from "./confetti";
import { FormContext } from "./forms";

/**
 * Constants
 */
const FORM_SELECTOR = "currentForm";
export const CHAIN_ID = 1;
export const MIN_PERCENTAGE = 0;
export const MAX_PERCENTAGE = 100;

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

  return (
    <div className={className}>
      <Formik
        validationSchema={ValidationSchema}
        validateOnMount={true}
        initialValues={{ ...DEFAULT_FORM_DATA }}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          if (!address) {
            console.log("User not connected");
            toast("Please connect your wallet", { type: "error" });
            return;
          } else if (chain?.id !== CHAIN_ID) {
            console.log(
              `On wrong network. Expect ${CHAIN_ID} Saw ${chain?.id}`,
            );
            toast("Please switch to the Ethereum network.", {
              type: "error",
            });
            return;
          } else if (!balanceLoading && balance && balance.value.isZero()) {
            console.log("No balance");
            toast(`No balance found for wallet ${address}`, { type: "error" });
            return;
          }

          // TODO: transfer logic
          confetti &&
            (await confetti.addConfetti({
              emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸"],
            }));
          setSubmitting(false);
          push("/app/zuzalu/billboard");
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
