import { useContext } from "react";
import { ProjectDataTableContext } from "../project-contexts";
import { DataTableHeaderComponentProps } from "../../../lib/data-table";

export function DataTableFieldDefaultLabel(
  props: DataTableHeaderComponentProps,
) {
  const tableControl = useContext(ProjectDataTableContext);
  const field = props.field;
  const isSorted = tableControl?.sorting.field === field.name;

  const onClick = () => {
    tableControl?.onSortChange(field.name);
  };

  return (
    <div
      className={field.name}
      onClick={onClick}
      style={isSorted ? { color: "red" } : {}}
    >
      {field.label}
    </div>
  );
}
