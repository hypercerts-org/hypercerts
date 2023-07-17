import { DataTableCellComponentProps } from "../../../lib/data-table";

export function DataTableFieldDefault(props: DataTableCellComponentProps) {
  let expandable = <></>;
  if (props.field.expandable) {
    expandable = (
      <div
        onClick={(e) => {
          e.preventDefault();
          props.onExpand(props.data, props.field);
        }}
      >
        {"<expand>"}
      </div>
    );
  }
  let value = props.value;
  if (typeof value === "number") {
    value = value.toLocaleString();
  }
  return (
    <div className={props.data._id}>
      {value}
      {expandable}
    </div>
  );
}
