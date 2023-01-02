import React, { ReactNode } from "react";
import dayjs from "dayjs";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { FormContext } from "./forms";

/**
 * Constants
 */
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 50;

export const DESCRIPTION_MIN_LENGTH = 20;
export const DESCRIPTION_MAX_LENGTH = 500;

export const DEFAULT_NUM_FRACTIONS = "100";
const DEFAULT_TIME = dayjs().format("YYYY-MM-DD");
const DEFAULT_FORM_DATA: HypercertCreateFormData = {
  name: "",
  description: "",
  external_link: "",
  contributors: "",

  prev_hypercert: "",
  creators: [],
  workTimeStart: new Date() as Date | undefined,
  workTimeEnd: DEFAULT_TIME as string | undefined,
  impactTimeStart: DEFAULT_TIME as string | undefined,
  impactTimeEnd: DEFAULT_TIME as string | undefined,
  workScopes: [] as Option[],
  impactScopes: [] as Option[],
  rights: [] as Option[],
  uri: "",
  fractions: DEFAULT_NUM_FRACTIONS,
  impactTimeInfinite: false,
};

export interface Option {
  label: string;
  value: string;
}
interface HypercertCreateFormData {
  name: string;
  description: string;
  external_link: string;
  contributors: string;
  prev_hypercert: string;
  creators: string[];
  workTimeStart?: Date;
  workTimeEnd?: string;
  impactTimeStart?: string;
  impactTimeEnd?: string;
  workScopes: Option[];
  impactScopes: Option[];
  rights: Option[];
  uri: string;
  fractions: string;
  impactTimeInfinite: boolean;
}

/**
 * Form validation rules
 */
const ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(NAME_MIN_LENGTH, "Too Short!")
    .max(NAME_MAX_LENGTH, "Too Long!")
    .required("Required"),
  description: Yup.string()
    .min(DESCRIPTION_MIN_LENGTH, "Too Short!")
    .max(DESCRIPTION_MAX_LENGTH, "Too Long!")
    .required("Required"),
  external_link: Yup.string()
    .required()
    .test("valid uri", "Please enter a valid url", (value) => {
      if (!value) return false;
      const isIpfsUrl = value.match(/^(ipfs):\/\//);

      if (isIpfsUrl) {
        return true;
      }

      try {
        const urlSchema = Yup.string().url();
        urlSchema.validateSync(value);
        return true;
      } catch (e) {
        return false;
      }
    }),
  workScopes: Yup.array().min(1),
  impactScopes: Yup.array().min(1),
  rights: Yup.array().min(1),
  workTimeEnd: Yup.date().when("workTimeStart", (workTimeStart) => {
    return Yup.date().min(workTimeStart, "End date must be after start date");
  }),
  impactTimeEnd: Yup.date().when(
    ["impactTimeStart", "impactTimeInfinite"],
    (impactTimeStart, impactTimeInfinite) => {
      return Yup.date().min(
        impactTimeInfinite ? 0 : impactTimeStart,
        "End date must be after start date"
      );
    }
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
  className?: string;       // Plasmic CSS class
  children?: ReactNode;     // Form elements
}

export function HypercertCreateForm(props: HypercertCreateFormProps) {
  const { className, children } = props;
  return (
    <div className={className}>
      <Formik
        validationSchema={ValidationSchema}
        validateOnMount={true}
        validate={(values) => {
          // TODO: updateQueryString(values);
        }}
        initialValues={{
          ...DEFAULT_FORM_DATA,
          //...query,
        }}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          setTimeout(() => {
            console.log("!!!");
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {(formikProps: FormikProps<HypercertCreateFormData>) => (
          <FormContext.Provider value={formikProps}>
            <form onSubmit={formikProps.handleSubmit}>
              { children }
            </form>
          </FormContext.Provider>
        )}
      </Formik>
    </div>
  );
}
