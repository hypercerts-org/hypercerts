import React, { useContext } from "react";

import { DataTableConfig } from "../../lib/data-table";
import { ProjectExpandedContext } from "./project-contexts";
import { ProjectViewsCollection, ProjectView } from "../../lib/projects";
import { DataTableFieldGrowth } from "./data-table/field-growth";
import { DataTableFieldProject } from "./data-table/field-project";
import { DataTable } from "./data-table/generic-data-table";
import _ from "lodash";

export interface ExpandedProjectDataTableProp {
  className?: string;
}

export function ExpandedProjectDataTable(props: ExpandedProjectDataTableProp) {
  const expandedContext = useContext(ProjectExpandedContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [dependents, setDependents] = React.useState<ProjectView[]>([]);

  React.useEffect(() => {
    setIsLoading(true);
    setDependents([]);
    async function getDependents() {
      console.log("called");
      const data = expandedContext.data;
      if (!data) {
        setIsLoading(false);
        setDependents([]);
        return;
      }
      setDependents(await data.dependents());
      setIsLoading(false);
    }
    getDependents();
  }, [expandedContext]);

  const { className } = props;
  let config: DataTableConfig;
  if (expandedContext.field?.name == "opMausReach") {
    config = {
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
  } else {
    config = {
      fieldOrder: ["project", "stars", "releases", "activeDevs"],
      fields: {
        project: {
          name: "project",
          type: "project",
          label: "Project",
          sortable: true,
          expandable: false,
          minWidth: 100,
        },
        stars: {
          name: "stars",
          type: "number",
          label: "# Stars",
          sortable: true,
          expandable: false,
          textAlign: "right",
        },
        releases: {
          name: "releases",
          type: "number",
          label: "# Releases",
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
  }

  if (isLoading) {
    return <div className={className}>Loading...</div>;
  }

  if (dependents.length === 0) {
    return <div className={className}>No depedents</div>;
  }

  const dependentsCollection = ProjectViewsCollection.fromArray(dependents);

  return (
    <div className={className}>
      <DataTable data={dependentsCollection} config={config}></DataTable>
    </div>
  );
}
