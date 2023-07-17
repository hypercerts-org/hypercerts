import { DataTableCellComponentProps } from "../../../lib/data-table";
import { ProjectStatus } from "../../../lib/projects";

export function DataTableFieldStatus(props: DataTableCellComponentProps) {
  const status = ProjectStatus[props.value];
  return (
    <span
      className={props.data._id + " status " + status.toLowerCase()}
      style={props.style}
    >
      <span className="dot"></span> {status}
    </span>
  );
}
