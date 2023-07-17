import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

export interface ExpandableIconProps {
  className?: string;
  isExpanded: boolean;
}

export function ExpandableIcon(props: ExpandableIconProps) {
  let icon = <ArrowDropDownIcon />;
  if (props.isExpanded) {
    icon = <ArrowDropUpIcon />;
  }

  return <span className={"expand-button " + props.className}>{icon}</span>;
}
