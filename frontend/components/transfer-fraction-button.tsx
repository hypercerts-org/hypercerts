import { Button } from "@mui/material";
import React from "react";

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
  return (
    <Button
      onClick={() =>
        console.log({
          fractionId,
          text,
          className,
          disabled,
        })
      }
    >
      Send
    </Button>
  );
}
