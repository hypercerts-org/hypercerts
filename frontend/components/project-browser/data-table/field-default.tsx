import { DataTableCellComponentProps } from "../../../lib/data-table";

export function DataTableFieldDefault(props: DataTableCellComponentProps) {
  let value = props.value;
  if (typeof value === "number") {
    value = value.toLocaleString();
  }
  return (
    <span className={props.data._id} style={props.style}>
      {value}
    </span>
  );
}
