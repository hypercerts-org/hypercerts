import { DataTableCellComponentProps } from "../../../lib/data-table";
import { ProjectStatus } from "../../../lib/projects";

export function DataTableFieldStatus(props: DataTableCellComponentProps) {
  const status = ProjectStatus[props.value];
  return (
    <div className={props.data._id + " status " + status.toLowerCase()}>
      <span className="dot"></span> {status}
    </div>
  );
}
