import { useAccountLowerCase } from "../hooks/account";
import { useConfetti } from "./confetti";
import { FormContext } from "./forms";
import { DataProvider } from "@plasmicapp/loader-nextjs";
import { Formik, FormikErrors, FormikProps } from "formik";
import _ from "lodash";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect } from "react";
import { toast } from "react-toastify";
import { isAddress } from "viem";
import { useAccount, useBalance } from "wagmi";
import * as Yup from "yup";

/**
 * Constants
 */
const FORM_SELECTOR = "currentForm";
const DESTINATION_ADDRESS = "fundingthecommons.eth";
export const CHAIN_ID = 1;
const ETH_PRICE = 1847.79;
export const MIN_PERCENTAGE = 0;
export const MAX_PERCENTAGE = 100;
const MAX_TEXT_LENGTH = 100;

// In USD
const pricePerPercent: Omit<FtcPurchaseFormData, "textForSponsor"> = {
  percentBuyingFtc001: 1500,
  percentBuyingFtc002: 300,
  percentBuyingFtc003: 500,
  percentBuyingFtc004: 150,
  percentBuyingFtc005: 150,
  percentBuyingFtc006: 150,
  percentBuyingFtc007: 150,
  percentBuyingFtc008: 150,
  percentBuyingFtc009: 150,
  percentBuyingFtc010: 150,
  percentBuyingFtc011: 150,
  percentBuyingFtc012: 150,
  percentBuyingFtc013: 150,
  percentBuyingFtc014: 150,
  percentBuyingFtc015: 150,
  percentBuyingFtc016: 150,
  percentBuyingFtc017: 150,
  percentBuyingFtc018: 150,
  percentBuyingFtc019: 150,
  percentBuyingFtc020: 150,
  percentBuyingFtc021: 150,
  percentBuyingFtc022: 150,
  percentBuyingFtc023: 150,
};

const DEFAULT_FORM_DATA: FtcPurchaseFormData = {
  percentBuyingFtc001: 0,
  percentBuyingFtc002: 0,
  percentBuyingFtc003: 0,
  percentBuyingFtc004: 0,
  percentBuyingFtc005: 0,
  percentBuyingFtc006: 0,
  percentBuyingFtc007: 0,
  percentBuyingFtc008: 0,
  percentBuyingFtc009: 0,
  percentBuyingFtc010: 0,
  percentBuyingFtc011: 0,
  percentBuyingFtc012: 0,
  percentBuyingFtc013: 0,
  percentBuyingFtc014: 0,
  percentBuyingFtc015: 0,
  percentBuyingFtc016: 0,
  percentBuyingFtc017: 0,
  percentBuyingFtc018: 0,
  percentBuyingFtc019: 0,
  percentBuyingFtc020: 0,
  percentBuyingFtc021: 0,
  percentBuyingFtc022: 0,
  percentBuyingFtc023: 0,
  textForSponsor: "",
};

interface FtcPurchaseFormData {
  percentBuyingFtc001: number | string;
  percentBuyingFtc002: number | string;
  percentBuyingFtc003: number | string;
  percentBuyingFtc004: number | string;
  percentBuyingFtc005: number | string;
  percentBuyingFtc006: number | string;
  percentBuyingFtc007: number | string;
  percentBuyingFtc008: number | string;
  percentBuyingFtc009: number | string;
  percentBuyingFtc010: number | string;
  percentBuyingFtc011: number | string;
  percentBuyingFtc012: number | string;
  percentBuyingFtc013: number | string;
  percentBuyingFtc014: number | string;
  percentBuyingFtc015: number | string;
  percentBuyingFtc016: number | string;
  percentBuyingFtc017: number | string;
  percentBuyingFtc018: number | string;
  percentBuyingFtc019: number | string;
  percentBuyingFtc020: number | string;
  percentBuyingFtc021: number | string;
  percentBuyingFtc022: number | string;
  percentBuyingFtc023: number | string;
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
  percentBuyingFtc001: PercentageSchema,
  percentBuyingFtc002: PercentageSchema,
  percentBuyingFtc003: PercentageSchema,
  percentBuyingFtc004: PercentageSchema,
  percentBuyingFtc005: PercentageSchema,
  percentBuyingFtc006: PercentageSchema,
  percentBuyingFtc007: PercentageSchema,
  percentBuyingFtc008: PercentageSchema,
  percentBuyingFtc009: PercentageSchema,
  percentBuyingFtc010: PercentageSchema,
  percentBuyingFtc011: PercentageSchema,
  percentBuyingFtc012: PercentageSchema,
  percentBuyingFtc013: PercentageSchema,
  percentBuyingFtc014: PercentageSchema,
  percentBuyingFtc015: PercentageSchema,
  percentBuyingFtc016: PercentageSchema,
  percentBuyingFtc017: PercentageSchema,
  percentBuyingFtc018: PercentageSchema,
  percentBuyingFtc019: PercentageSchema,
  percentBuyingFtc020: PercentageSchema,
  percentBuyingFtc021: PercentageSchema,
  percentBuyingFtc022: PercentageSchema,
  percentBuyingFtc023: PercentageSchema,
  textForSponsor: Yup.string().max(
    MAX_TEXT_LENGTH,
    `Must be at most ${MAX_TEXT_LENGTH} characters`,
  ),
});

export interface FtcPurchaseFormProps {
  className?: string; // Plasmic CSS class
  children?: ReactNode; // Form elements
}

export function FtcPurchaseForm(props: FtcPurchaseFormProps) {
  const [writeable, setWriteable] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<{ [key: string]: string }>();

  const { className, children } = props;
  const { address, isConnected } = useAccountLowerCase();
  const { data: balance } = useBalance({ address: address as `0x${string}` });
  const { chain } = useAccount();
  const { push } = useRouter();
  const confetti = useConfetti();

  const [ethValue, setEthValue] = React.useState<number>(0);
  const [wagmiErr, setWagmiErr] = React.useState<Error | undefined>();

  const checkWriteable = async () => {
    setWriteable(false);
    const currentErrors: { [key: string]: string } = {};

    if (!isConnected) {
      console.log("User not connected");
      currentErrors["connection"] =
        "You appear to not be connected. Please connect your wallet";
    }

    if (!address || !isAddress(address)) {
      console.log("No address found");
      currentErrors[
        "address"
      ] = `No -valid- address found [${address}]. Please connect your wallet`;
    }

    if (!balance || balance.value == 0n) {
      console.log("No balance");
      currentErrors["balance"] = "Please add funds to your wallet";
    }

    if (!chain) {
      console.log("No chain found");
      currentErrors["chain"] =
        "No connected chain found. Please connect your wallet";
    }

    if (chain && chain.id !== CHAIN_ID) {
      console.log(`On wrong network HERE. Expect ${CHAIN_ID} Saw ${chain?.id}`);

      currentErrors["chain"] = `Wrong network. Please connect to ${CHAIN_ID}`;
    }

    if (Object.keys(currentErrors).length == 0) {
      console.log("no errors");
      setWriteable(true);
    } else {
      console.log("errors detected");
      setWriteable(false);
    }
    setErrors(currentErrors);
  };

  useEffect(() => {
    checkWriteable();
  }, [address, balance, chain]);

  const checkCanSubmit = (
    formValues: FtcPurchaseFormData,
    formErrors: FormikErrors<FtcPurchaseFormData>,
    onSubmit: () => void,
  ) => {
    if (errors && Object.keys(errors).length > 0) {
      console.error(errors);
      for (const error in errors) {
        toast(errors[error], {
          type: "error",
        });
      }

      return;
    }

    if (!writeable) {
      toast("Cannot execute transaction. Check logs for errors", {
        type: "error",
      });
      return;
    }

    console.log("Submitting form...");
    console.log("Form values: ", formValues);
    console.log("Form errors: ", formErrors);
    onSubmit();
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
            k.startsWith("percentBuyingFtc"),
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
          setEthValue(totalETH);
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
        {(formikProps: FormikProps<FtcPurchaseFormData>) => (
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
