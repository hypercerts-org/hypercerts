import { Box, Button, Input, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import { FieldArray, Form, Formik } from "formik";
import { useFractionById } from "../hooks/fractions";
import { PlusIcon } from "primereact/icons/plus";
import { Delete } from "@mui/icons-material";
import { useSplitFractionUnits } from "../hooks/splitClaimUnits";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

interface Props {
  fractionId: string;
  text?: string;
  disabled?: boolean;
  className?: string;
}
export function SplitFractionButton({
  fractionId,
  text,
  className,
  disabled,
}: Props) {
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { write, readOnly, txPending } = useSplitFractionUnits({
    onComplete: () => {
      toast("Splitting fraction completed");
      handleClose();
    },
  });

  const { data, isLoading } = useFractionById(fractionId);

  console.log(data, isLoading);

  if (isLoading || !data?.claimToken) {
    return null;
  }

  const totalValue = parseInt(data.claimToken.units, 10);

  const _disabled = txPending || readOnly || isLoading || disabled;

  return (
    <>
      <Button className={className} disabled={disabled} onClick={handleOpen}>
        {text}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Split up your fraction
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
            Make sure the total value of the fractions is equal to the original
          </Typography>
          <Formik
            initialValues={{ units: [totalValue] }}
            validate={(values) => {
              if (!values.units.length) {
                return { units: "Required" };
              }
              const totalValueInForm = values.units.reduce(
                (sum, value) => sum + value,
                0,
              );

              if (totalValueInForm !== totalValue) {
                return {
                  units: "Total value must be equal to the original value",
                };
              }
            }}
            onSubmit={async (values) => {
              const tokenId = data.claimToken?.tokenID;
              if (!tokenId) {
                return;
              }
              await write(
                tokenId,
                values.units.map((x) => BigInt(x)),
              );
            }}
          >
            {({ values, errors, setFieldValue, isValid, isSubmitting }) => {
              const isDisabled = _disabled || isSubmitting;
              return (
                <Form>
                  <FieldArray
                    name="units"
                    render={(arrayHelpers) => (
                      <div>
                        {values.units && values.units.length > 0 ? (
                          values.units.map((unit, index) => (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                marginBottom: "1rem",
                              }}
                            >
                              {/*<Field name={} />*/}
                              <Input
                                sx={{ mr: 1 }}
                                value={unit}
                                name={`units.${index}`}
                                disabled={isDisabled}
                                onChange={(e) =>
                                  setFieldValue(
                                    `units.${index}`,
                                    isNaN(parseInt(e.target.value))
                                      ? 0
                                      : parseInt(e.target.value),
                                  )
                                }
                              />

                              <Button
                                sx={{ mr: 1 }}
                                variant="contained"
                                disabled={isDisabled}
                                startIcon={<Delete />}
                                onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                              >
                                Delete
                              </Button>

                              <Button
                                variant="contained"
                                disabled={isDisabled}
                                onClick={() =>
                                  arrayHelpers.insert(index + 1, 0)
                                } // remove a friend from the list
                                startIcon={<PlusIcon />}
                              >
                                Add
                              </Button>
                            </div>
                          ))
                        ) : (
                          <Button
                            disabled={isDisabled}
                            type="button"
                            onClick={() => arrayHelpers.push("")}
                          >
                            {/* show this when user has removed all friends from the list */}
                            Add a friend
                          </Button>
                        )}
                        {errors.units && (
                          <div className="error">{errors.units as string}</div>
                        )}

                        <div>
                          <Button disabled={!isValid} type="submit">
                            Submit
                          </Button>
                        </div>
                      </div>
                    )}
                  />
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Modal>
    </>
  );
}
