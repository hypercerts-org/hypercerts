import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { formatAddress } from "../lib/formatting";
import { TransferRestrictions } from "@hypercerts-org/sdk";
import { useReadTransferRestrictions } from "../hooks/readTransferRestriction";

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

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const { data: fractionData, isLoading: isLoadingFraction } =
    useFractionById(fractionId);

  const { data: claim, isLoading: isLoadingClaim } = useClaimById(
    fractionData?.claimToken?.claim.id,
  );

  const {
    data: transferRestrictions,
    isLoading: isLoadingTransferRestrictions,
  } = useReadTransferRestrictions(claim?.claim?.tokenID);

  const determineCanTransfer = () => {
    if (!address) {
      return false;
    }

    if (!transferRestrictions) {
      return false;
    }

    if (!(fractionData?.claimToken?.owner === address)) {
      return false;
    }

    if (!(transferRestrictions in TransferRestrictions)) {
      return false;
    }

    const transferRestrictionValue =
      TransferRestrictions[
        transferRestrictions as keyof typeof TransferRestrictions
      ];

    if (transferRestrictionValue === TransferRestrictions.DisallowAll) {
      return false;
    }

    if (transferRestrictionValue === TransferRestrictions.AllowAll) {
      return true;
    }

    if (transferRestrictionValue === TransferRestrictions.FromCreatorOnly) {
      return claim?.claim?.creator === address;
    }

    return false;
  };

  const canTransfer = determineCanTransfer();

  const tokenId = fractionId.split("-")[1];
  const _disabled =
    txPending ||
    readOnly ||
    disabled ||
    isLoadingFraction ||
    isLoadingClaim ||
    isLoadingTransferRestrictions;

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
            onSubmit={() => {
              handleDialogOpen();
            }}
          >
            {({ isSubmitting, isValid, setFieldValue, errors, values }) => {
              const isDisabled = _disabled || isSubmitting;
              return (
                <>
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
                    <Button disabled={!isValid} type={"submit"}>
                      Transfer
                    </Button>
                  </Form>{" "}
                  <Dialog
                    open={dialogOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      Are you sure you want to transfer?
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Transferring to {formatAddress(values.to)}. This action
                        cannot be reversed.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button color="error" onClick={handleDialogClose}>
                        cancel
                      </Button>
                      <Button
                        color="primary"
                        onClick={async () => {
                          await write(BigInt(tokenId), values.to);
                        }}
                        autoFocus
                      >
                        transfer
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              );
            }}
          </Formik>
        </Box>
      </Modal>
    </>
  );
}
