import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { DataTableField } from "../../../lib/data-table";

export interface ExpandableProps {
  className?: string;
  isExpanded: boolean;
  field: DataTableField;
  data: any;
  onExpand: (data: any, field: DataTableField) => void;
}

export function Expandable(props: ExpandableProps) {
  const { data, field, onExpand, className } = props;
  let icon = (
    <KeyboardArrowDownIcon
      htmlColor="#888"
      style={{ transition: "transform 0.5s" }}
    />
  );

  if (props.isExpanded) {
    icon = (
      <KeyboardArrowDownIcon
        htmlColor="#888"
        style={{ transform: "rotate(180deg)", transition: "transform 0.5s" }}
      />
    );
  }

  if (!field.expandable) {
    return <></>;
  }

  if (field.expandableCb) {
    if (!field.expandableCb(data)) {
      return <></>;
    }
  }

  return (
    <span
      onClick={(e) => {
        e.preventDefault();
        onExpand(data, field);
      }}
      style={{ display: "inline" }}
      className={"expand-button " + className}
    >
      {icon}
    </span>
  );
}
