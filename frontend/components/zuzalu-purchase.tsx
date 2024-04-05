import { FormContext } from "./forms";
import { DataProvider } from "@plasmicapp/loader-nextjs";
import { Formik, FormikErrors, FormikProps } from "formik";
import _ from "lodash";
import React, { ReactNode } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

/**
 * Constants
 */
const FORM_SELECTOR = "currentForm";
const DESTINATION_ADDRESS = "zuzalu.eth";
export const CHAIN_ID = 1;
const ETH_PRICE = 1847.79;
export const MIN_PERCENTAGE = 0;
export const MAX_PERCENTAGE = 100;
const MAX_TEXT_LENGTH = 100;

// In USD
const pricePerPercent: Omit<ZuzaluPurchaseFormData, "textForSponsor"> = {
  percentBuyingZuzalu001: 150,
  percentBuyingZuzalu002: 50,
  percentBuyingZuzalu003: 150,
  percentBuyingZuzalu004: 200,
  percentBuyingZuzalu005: 50,
  percentBuyingZuzalu006: 100,
  percentBuyingZuzalu007: 100,
  percentBuyingZuzalu008: 100,
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
  percentBuyingZuzalu023: 150,
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
  percentBuyingZuzalu023: 0,
  textForSponsor: "",
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
  percentBuyingZuzalu023: number | string;
  textForSponsor: string;
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
  percentBuyingZuzalu023: PercentageSchema,
  textForSponsor: Yup.string().max(
    MAX_TEXT_LENGTH,
    `Must be at most ${MAX_TEXT_LENGTH} characters`,
  ),
});

export interface ZuzaluPurchaseFormProps {
  className?: string; // Plasmic CSS class
  children?: ReactNode; // Form elements
}

export function ZuzaluPurchaseForm(props: ZuzaluPurchaseFormProps) {
  const { className, children } = props;

  const checkCanSubmit = (
    formValues: ZuzaluPurchaseFormData,
    formErrors: FormikErrors<ZuzaluPurchaseFormData>,
    onSubmit: () => void,
  ) => {
    console.error("FTC purchases are disabled");
    toast("FTC purchases are disabled", {
      type: "error",
    });
  };

  return (
    <div className={className}>
      <Formik
        validationSchema={ValidationSchema}
        validateOnMount={true}
        validate={(values) => {
          // console.log(values);
          // Get just the percentages
          const filteredValues = _.pickBy(values, (v, k) =>
            k.startsWith("percentBuyingZuzalu"),
          );
          // Parse any strings
          const parsedValues = _.mapValues(
            filteredValues,
            (v: string | number) => (typeof v == "string" ? parseFloat(v) : v),
          );
          // Remove all NaNs
          const cleanedValues = _.mapValues(parsedValues, (v: number) =>
            isNaN(v) ? 0 : v,
          );
          // Calculate value in dollars
          const valuesInDollars = _.mergeWith(
            cleanedValues,
            pricePerPercent,
            (percent, price) => percent * price,
          );
          // Extract just dollar amounts
          const dollarArray = _.values(valuesInDollars);
          // Calculate equivalent total ETH
          const totalUSD = _.sum(dollarArray);
          const totalETH = totalUSD / ETH_PRICE;
        }}
        initialValues={{ ...DEFAULT_FORM_DATA }}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          console.error("FTC purchases are disabled");
          toast("FTC purchases are disabled", {
            type: "error",
          });
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
                  checkCanSubmit(
                    formikProps.values,
                    formikProps.errors,
                    formikProps.handleSubmit,
                  );
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
