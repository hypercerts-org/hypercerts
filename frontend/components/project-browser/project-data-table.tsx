import React from "react";

import {
  RawCollection,
  DataTableConfig,
  Collection,
} from "../../lib/data-table";
import { IProjectView } from "../../lib/projects";
import { DataTableFieldGrowth } from "./data-table/field-growth";
import { DataTableFieldProject } from "./data-table/field-project";
import { DataTableFieldStatus } from "./data-table/field-status";
import { DataTable } from "./data-table/generic-data-table";
import { ExpandedProjectDataTable } from "./expanded-project-data-table";

export interface ProjectDataTableProps {
  className?: string;
  renderWithTestData?: boolean;
  data: Collection<IProjectView>;
  testData?: RawCollection;
  sortAsc?: boolean;
  onSortingChange?: (fieldName: string) => void;
}

export function ProjectDataTable(props: ProjectDataTableProps) {
  const { className } = props;
  const config: DataTableConfig = {
    fieldOrder: [
      "project",
      "status",
      "dependencies",
      "activeDevs",
      "devReach",
      "opMaus",
      "opMausReach",
    ],
    fields: {
      project: {
        name: "project",
        type: "project",
        label: "Project",
        sortable: true,
        expandable: false,
        minWidth: 100,
      },
      status: {
        name: "status",
        type: "status",
        label: "Status",
        sortable: true,
        expandable: false,
        minWidth: 60,
      },
      dependencies: {
        name: "dependencies",
        type: "number",
        label: "Dependencies",
        sortable: true,
        expandable: false,
        textAlign: "right",
      },
      activeDevs: {
        name: "activeDevs",
        type: "growth",
        label: "Active Devs (Growth)",
        sortable: true,
        expandable: false,
        textAlign: "right",
      },
      devReach: {
        name: "devReach",
        type: "growth",
        label: "Dev Reach (Growth)",
        sortable: true,
        expandable: true,
        textAlign: "right",
      },
      opMaus: {
        name: "opMaus",
        type: "growth",
        label: "Op MAUs (Growth)",
        sortable: true,
        expandable: false,
        textAlign: "right",
      },
      opMausReach: {
        name: "opMausReach",
        type: "growth",
        label: "Op MAUs Reach (Growth)",
        sortable: true,
        expandable: true,
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
      status: {
        cellComponent: DataTableFieldStatus,
      },
    },
  };

  return (
    <div className={className}>
      <DataTable config={config} {...props}>
        <ExpandedProjectDataTable></ExpandedProjectDataTable>
      </DataTable>
    </div>
  );
}
