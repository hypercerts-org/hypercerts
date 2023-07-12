import { DataTableCellComponentProps } from "../../../lib/data-table";

export function DataTableFieldDefault(props: DataTableCellComponentProps) {
  return <div className={props.data._id}>{props.value}</div>;
}
