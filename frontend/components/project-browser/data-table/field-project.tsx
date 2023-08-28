import { DataTableCellComponentProps } from "../../../lib/data-table";

type ProjectValue = {
  name: number;
  repo: number;
};

export function DataTableFieldProject(props: DataTableCellComponentProps) {
  if (!props.value?.name || !props.value?.repo) {
    throw new Error(`Project field value ${props.value} is invalid`);
  }

  const value = props.value as ProjectValue;

  return (
    <div
      className={props.data._id + " project"}
      style={{ display: "inline-block" }}
    >
      <div className="name">{value.name}</div>
      <div className="repo">{value.repo}</div>
    </div>
  );
}
