import React from "react";
import { useBurnFraction } from "../hooks/burnFraction";
import { Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import useCheckWriteable from "../hooks/checkWriteable";
import { toast } from "react-toastify";

type BurnFractionButtonProps = {
  text: string;
  fractionId: string;
  disabled: boolean;
  className: string;
};

export const BurnFractionButton = ({
  text = "Burn",
  fractionId,
  disabled,
  className,
}: BurnFractionButtonProps) => {
  const { push } = useRouter();
  const { checking, writeable, errors } = useCheckWriteable();

  const { write, txPending } = useBurnFraction({
    onComplete: () => push("/app/dashboard"),
  });
  /**
   * TODO: Sometimes the modal wont close when react strict mode is on.
   * Shouldn't happen in production because strict mode is turned off there
   * Related to https://github.com/Network-Goods/hypercerts-protocol/issues/80
   */

  const handleClick = async () => {
    if (errors) {
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

    write(BigInt(fractionId));
  };

  return (
    <Button
      className={className}
      disabled={!writeable || disabled || txPending || checking}
      onClick={handleClick}
      startIcon={
        txPending || checking ? <CircularProgress size="1rem" /> : undefined
      }
    >
      {text}
    </Button>
  );
};

export default BurnFractionButton;
