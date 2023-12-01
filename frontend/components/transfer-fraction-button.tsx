import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import React, { useState } from "react";
import { useTransferFraction } from "../hooks/transferFraction";
import { Form, Formik } from "formik";
import { isAddress } from "viem";
import { useClaimById, useFractionById } from "../hooks/fractions";
import { useAccountLowerCase } from "../hooks/account";

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
export function TransferFractionButton({
  fractionId,
  text,
  className,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { address } = useAccountLowerCase();

  const { write, readOnly, txPending } = useTransferFraction({
    onComplete: () => {
      handleClose();
    },
  });

  const { data: fractionData, isLoading: isLoadingFraction } =
    useFractionById(fractionId);

  const { data: claim, isLoading: isLoadingClaim } = useClaimById(
    fractionData?.claimToken?.claim.id,
  );

  const canTransfer = !!address && claim?.claim?.creator === address;

  const tokenId = fractionId.split("-")[1];
  const _disabled =
    txPending || readOnly || disabled || isLoadingFraction || isLoadingClaim;

  if (!canTransfer) {
    return null;
  }

  return (
    <>
      <IconButton
        size="small"
        aria-label="transfer"
        color="primary"
        disabled={_disabled}
        onClick={() => {
          console.log({
            fractionId,
            text,
            className,
            disabled,
          });
          handleOpen();
        }}
      >
        <Send fontSize="inherit" />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Formik
            initialValues={{ to: "" }}
            validate={(values) => {
              if (!values.to || values.to === "") {
                return { to: "Required" };
              }

              if (!isAddress(values.to)) {
                return { to: "Invalid address" };
              }
            }}
            onSubmit={async (values) => {
              await write(BigInt(tokenId), values.to);
            }}
          >
            {({ isSubmitting, isValid, setFieldValue, errors }) => {
              const isDisabled = _disabled || isSubmitting;
              return (
                <Form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Transfer this fraction
                  </Typography>
                  <TextField
                    error={!!errors.to}
                    helperText={errors.to}
                    name="to"
                    required
                    style={{ width: "100%" }}
                    disabled={isDisabled}
                    placeholder="Recipient address"
                    onChange={(e) => {
                      setFieldValue("to", e.target.value);
                    }}
                  />
                  <Button disabled={!isValid} type="submit">
                    Transfer
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Modal>
    </>
  );
}
