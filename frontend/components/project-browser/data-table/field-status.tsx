import { DataTableCellComponentProps } from "../../../lib/data-table";

export function DataTableFieldStatus(props: DataTableCellComponentProps) {
  return (
    <div className={props.data._id + " status " + props.value}>
      <span className="dot"></span> {props.value}
    </div>
  );
}
