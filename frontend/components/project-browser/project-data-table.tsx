import React from "react";

import styles from "./css/data-table.module.css";
import {
  RawCollection,
  DataTableConfig,
  DataTableHeaderComponent,
} from "../../lib/data-table";
import { ProjectViewsCollection } from "../../lib/projects";
import { DataTableFieldGrowth } from "./data-table/field-growth";
import { DataTableFieldProject } from "./data-table/field-project";
import { DataTableFieldStatus } from "./data-table/field-status";
import {
  ProjectDataTableContext,
  IProjectDataTableControl,
} from "./project-contexts";
import { DataTableFieldDefaultLabel } from "./data-table/field-label";
import { DataTableFieldDefault } from "./data-table/field-default";

export interface ProjectDataTableProps {
  className?: string;
  renderWithTestData?: boolean;
  data: ProjectViewsCollection;
  testData?: RawCollection;
  sortAsc?: boolean;
  onSortingChange?: (fieldName: string) => void;
}

export function ProjectDataTable(props: ProjectDataTableProps) {
  const { className, data, renderWithTestData, testData } = props;
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
        expandable: true,
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

  const renderHeader = () => {
    return (
      <thead>
        <tr>
          {config.fieldOrder.map((fieldName) => {
            const field = config.fields[fieldName];
            const typeConfig = config.types[field.type];
            let HeaderComponent: DataTableHeaderComponent =
              DataTableFieldDefaultLabel;
            if (typeConfig?.headerComponent !== undefined) {
              HeaderComponent = typeConfig.headerComponent;
            }
            return (
              <td
                key={fieldName}
                className={fieldName}
                style={{ minWidth: field.minWidth, textAlign: field.textAlign }}
              >
                <HeaderComponent key={fieldName} field={field} />
              </td>
            );
          })}
        </tr>
      </thead>
    );
  };

  const renderBody = () => {
    if (data.items.length === 0) {
      return (
        <tbody>
          <tr className="empty">
            <td colSpan={config.fieldOrder.length}>No results</td>
          </tr>
        </tbody>
      );
    }
    return (
      <tbody>
        {data.items.map((item) => {
          return (
            <tr className="item" key={item.id}>
              {config.fieldOrder.map((fieldName) => {
                const field = config.fields[fieldName];
                const typeConfig = config.types[field.type];
                let CellComponent = DataTableFieldDefault;
                if (typeConfig?.cellComponent !== undefined) {
                  CellComponent = typeConfig.cellComponent;
                }
                return (
                  <td
                    key={fieldName}
                    className={fieldName}
                    style={{
                      minWidth: field.minWidth,
                      textAlign: field.textAlign,
                    }}
                  >
                    <CellComponent
                      key={fieldName}
                      field={field}
                      value={item[fieldName]}
                      data={item}
                    />
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    );
  };

  const control: IProjectDataTableControl = {
    onSortChange: (field) => {
      console.log(field);
      if (props.onSortingChange) {
        props.onSortingChange(field);
      }
    },
    sorting: data.meta.sorting,
  };

  return (
    <div className={className}>
      <ProjectDataTableContext.Provider value={control}>
        <table className={styles["project-data-table"]}>
          {renderHeader()}
          {renderBody()}
        </table>
      </ProjectDataTableContext.Provider>
    </div>
  );
}
