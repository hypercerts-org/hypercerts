import React from "react";
import MuiTooltip from "@mui/material/Tooltip";

export interface TooltipProps {
  className?: string; // Plasmic CSS class
  title?: string; // Content in tooltip
  children?: any; // Child elements
}

export function Tooltip(props: TooltipProps) {
  const { className, title, children } = props;
  return (
    <MuiTooltip title={title}>
      <div className={className}>{children}</div>
    </MuiTooltip>
  );
}
