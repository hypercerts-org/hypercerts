import { createContext } from "react";
import { IProjectsClient, NullProjectsClient } from "../../lib/projects";
import { SortState, DataTableField } from "../../lib/data-table";

export interface IProjectDataTableControl {
  onSortChange: (field: string) => void;
  sorting: SortState;
}

export const ProjectDataTableContext = createContext<
  IProjectDataTableControl | undefined
>(undefined);

export const ProjectsClientContext = createContext<IProjectsClient>(
  new NullProjectsClient(),
);

export const ProjectExpandedContext = createContext<{
  data?: any;
  field?: DataTableField;
}>({});
