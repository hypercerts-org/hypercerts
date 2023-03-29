import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiAccordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import MuiTooltip from "@mui/material/Tooltip";
import React from "react";

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

export interface AccordionProps {
  className?: string; // Plasmic CSS class
  summary?: any; // Shows up in the header
  children?: any; // Child elements
}

export function Accordion(props: AccordionProps) {
  const { className, summary, children } = props;
  return (
    <div className={className}>
      <MuiAccordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {summary}
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </MuiAccordion>
    </div>
  );
}
