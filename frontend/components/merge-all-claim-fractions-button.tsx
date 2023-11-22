import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useMergeFractionUnits } from "../hooks/mergeFractionUnits";
import { toast } from "react-toastify";
import { useHypercertClient } from "../hooks/hypercerts-client";
import { useAccountLowerCase } from "../hooks/account";

interface Props {
  claimId: string;
  text?: string;
  disabled?: boolean;
  className?: string;
}

export function MergeAllClaimFractionsButton({
  text,
  claimId,
  className,
  disabled,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const { write, readOnly, txPending } = useMergeFractionUnits({});
  const { client, isLoading } = useHypercertClient();
  const { address } = useAccountLowerCase();

  const onClick = async () => {
    console.log("Merging all claim fractions", claimId);
    setOpen(false);
    if (readOnly) {
      toast("Please connect your wallet to merge all claim fractions");
      return;
    }

    if (isLoading) {
      toast("Please wait for the client to be ready");
      return;
    }

    if (!client) {
      toast("Please connect your wallet to merge all claim fractions");
      return;
    }

    if (!address) {
      toast("Please connect your wallet to merge all claim fractions");
      return;
    }

    const fractionUnits = await client.indexer.fractionsByClaim(claimId);
    console.log("Fraction units", fractionUnits);

    const myFractions = fractionUnits.claimTokens.filter(
      (fraction) => fraction.owner === address,
    );

    console.log("address", address);
    console.log("My fractions", myFractions);

    if (!myFractions.length) {
      toast("No fractions to merge");
      return;
    }

    await write(myFractions.map((fraction) => fraction.tokenID));
  };

  const isDisabled = disabled || txPending || readOnly || isLoading;

  return (
    <>
      <Button
        disabled={isDisabled}
        className={className}
        onClick={() => setOpen(true)}
      >
        {text}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Merge all your fractions for this hypercert?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be reversed
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Disagree</Button>
          <Button onClick={onClick} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
