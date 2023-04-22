import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiAccordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import MuiTooltip, {
  TooltipProps as MuiTooltipProps,
  tooltipClasses,
} from "@mui/material/Tooltip";
import ReactMarkdown from "react-markdown";
import React from "react";

export interface TooltipProps {
  className?: string; // Plasmic CSS class
  title?: string; // Content in tooltip
  children?: any; // Child elements
  fontSize?: number; // Font size
  color?: string; // Font color
  backgroundColor?: string; // background color
}

export function Tooltip(props: TooltipProps) {
  const { className, title, children, fontSize, color, backgroundColor } =
    props;
  const StyledTooltip = styled(({ className, ...props }: MuiTooltipProps) => (
    <MuiTooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      ...(fontSize ? { fontSize } : {}),
      ...(color ? { color } : {}),
      ...(backgroundColor ? { backgroundColor } : {}),
      boxShadow: theme.shadows[1],
    },
  }));
  return (
    <StyledTooltip title={title}>
      <div className={className}>{children}</div>
    </StyledTooltip>
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

/**
 * Basic widget to render markdown
 */
export interface MarkdownProps {
  className?: string; // Plasmic CSS class
  markdown?: string;
}

export function Markdown(props: MarkdownProps) {
  const { className, markdown } = props;
  return (
    <div className={className}>
      <ReactMarkdown>{markdown ?? ""}</ReactMarkdown>
    </div>
  );
}
