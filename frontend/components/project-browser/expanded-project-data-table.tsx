import React, { useContext } from "react";

import { DataTableConfig } from "../../lib/data-table";
import { ProjectExpandedContext } from "./project-contexts";
import { ProjectViewsCollection, ProjectView } from "../../lib/projects";
import { DataTableFieldGrowth } from "./data-table/field-growth";
import { DataTableFieldProject } from "./data-table/field-project";
import { DataTable } from "./data-table/generic-data-table";

export interface ExpandedProjectDataTableProp {
  className?: string;
}

export function ExpandedProjectDataTable(props: ExpandedProjectDataTableProp) {
  const expandedContext = useContext(ProjectExpandedContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [dependents, setDependents] = React.useState<ProjectView[]>([]);
  const [animHeight, setAnimHeight] = React.useState(0);

  const innerDivRef = React.useCallback(
    (node: HTMLDivElement) => {
      if (!node) {
        return;
      }
      setAnimHeight(node.getBoundingClientRect().height);
    },
    [dependents, isLoading, expandedContext],
  );

  React.useEffect(() => {
    setIsLoading(true);
    setDependents([]);
    async function getDependents() {
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

  // React.useEffect(() => {
  //   console.log("reported height");
  //   console.log(innerDivRef.current?.offsetHeight);
  //   setAnimHeight(innerDivRef.current?.offsetHeight || 0);
  // }, [innerDivRef])

  const { className } = props;
  let config: DataTableConfig;
  let title = "";
  if (expandedContext.field?.name == "opMausReach") {
    title = "Dependent Contracts";
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
    title = "Dependent Repos";
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

  const innerStyle: React.CSSProperties = {
    maxHeight: animHeight,
    transition: "max-height 1s",
    overflow: "hidden",
  };

  const classNames = "expanded " + className;

  let inner = (
    <div ref={innerDivRef} className="loading">
      Loading...
    </div>
  );

  if (!isLoading) {
    if (dependents.length === 0) {
      inner = (
        <div ref={innerDivRef} className="no-data">
          No dependents
        </div>
      );
    } else {
      const dependentsCollection = ProjectViewsCollection.fromArray(dependents);
      inner = (
        <div ref={innerDivRef}>
          <div className="title">{title}</div>
          <DataTable data={dependentsCollection} config={config}></DataTable>
        </div>
      );
    }
  }

  return (
    <div className={classNames} style={innerStyle}>
      {inner}
    </div>
  );
}
