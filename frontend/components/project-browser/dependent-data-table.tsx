import React, { useContext } from "react";

import {
  RawCollection,
  DataTableConfig,
  DataTableHeaderComponent,
  DataTableField,
} from "../../lib/data-table";
import {
  ProjectViewsCollection,
  IProjectView,
  ProjectView,
} from "../../lib/projects";
import { DataTableFieldGrowth } from "./data-table/field-growth";
import { DataTableFieldProject } from "./data-table/field-project";
import { DataTable } from "./data-table/generic-data-table";
import { DataTableFieldStatus } from "./data-table/field-status";
import { ProjectExpandedContext } from "./project-contexts";

export interface DependentDataTableProp {
  className?: string;
  project: ProjectView;
}

export function DependentDataTable(props: DependentDataTableProp) {
  const { className } = props;
  const config: DataTableConfig = {
    fieldOrder: ["project", "contracts", "factories", "opMausReach"],
    fields: {
      project: {
        name: "project",
        type: "project",
        label: "Project",
        sortable: true,
        expandable: false,
        minWidth: 100,
      },
      contracts: {
        name: "contracts",
        type: "number",
        label: "# Contracts",
        sortable: true,
        expandable: false,
        textAlign: "right",
      },
      factories: {
        name: "factories",
        type: "number",
        label: "# Factories",
        sortable: true,
        expandable: false,
        textAlign: "right",
      },
      opMausReach: {
        name: "opMausReach",
        type: "growth",
        label: "Op MAUs Reach (Growth)",
        sortable: true,
        expandable: false,
        textAlign: "right",
      },
    },
    types: {
      growth: {
        cellComponent: DataTableFieldGrowth,
      },
      project: {
        cellComponent: DataTableFieldProject,
      },
    },
  };

  return <div className={className}></div>;
}
