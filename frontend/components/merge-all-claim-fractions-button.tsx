import React from "react";
import { Button } from "@mui/material";

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
  const onClick = async () => {
    console.log("Merging all claim fractions", claimId);
  };

  return (
    <Button disabled={disabled} className={className} onClick={onClick}>
      {text}
    </Button>
  );
}
