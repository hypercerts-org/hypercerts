import React from "react";
import { useBurnFraction } from "../hooks/burnFraction";
import { Button } from "@mui/material";
import { useRouter } from "next/router";

type BurnFractionButtonProps = {
  fractionId: string;
  disabled: boolean;
  className: string;
};

export const BurnFractionButton = ({
  fractionId,
  disabled,
  className,
}: BurnFractionButtonProps) => {
  const { push } = useRouter();

  const { write } = useBurnFraction({
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
    <Button className={className} disabled={disabled} onClick={handleClick}>
      Burn
    </Button>
  );
};

export default BurnFractionButton;
