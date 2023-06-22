import React from "react";
import { useBurnFraction } from "../hooks/burnFraction";
import { Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";

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

  const { write, txPending } = useBurnFraction({
    onComplete: () => push("/app/dashboard"),
  });
  /**
   * TODO: Sometimes the modal wont close when react strict mode is on.
   * Shouldn't happen in production because strict mode is turned off there
   * Related to https://github.com/Network-Goods/hypercerts-protocol/issues/80
   */

  const handleClick = () => {
    write(fractionId);
  };
  return (
    <Button
      className={className}
      disabled={disabled || txPending}
      onClick={handleClick}
      startIcon={txPending ? <CircularProgress size="1rem" /> : undefined}
    >
      {text}
    </Button>
  );
};

export default BurnFractionButton;
