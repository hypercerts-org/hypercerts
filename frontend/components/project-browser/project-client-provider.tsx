import React, { ReactNode } from "react";
import { DataProvider } from "@plasmicapp/loader-nextjs";
import { RawCollection, SortingDirection } from "../../lib/data-table";
import {
  IProjectsClient,
  NullProjectsClient,
  ProjectFilters,
  ProjectsClient,
  StaticProjectsClient,
} from "../../lib/projects";
import { ProjectsClientContext } from "./project-contexts";

export type ProjectsClientProviderTestData = {
  filterOptions: ProjectFilters;
  projects: RawCollection;
};

export type ProjectsClientProviderProps = {
  children?: ReactNode;
  className?: string;
  variableName: string;
  testData?: ProjectsClientProviderTestData;
  useTestData?: boolean;
};

// Provides access to the projects client both through the context and the data
// provider for plasmic users. Probably a bit superfluous.
export function ProjectsClientProvider(props: ProjectsClientProviderProps) {
  const { children, className, variableName, useTestData, testData } = props;
  const [client, setClient] = React.useState<IProjectsClient>(
    new NullProjectsClient(),
  );

  React.useEffect(() => {
    // Should connect to client here
    if (useTestData) {
      if (testData) {
        setClient(
          StaticProjectsClient.loadFromRaw(
            testData.filterOptions,
            testData.projects,
          ),
        );
      }
    } else {
      setClient(new ProjectsClient());
    }
  }, []);

  return (
    <div className={className}>
      <ProjectsClientContext.Provider value={client}>
        <DataProvider name={variableName} data={client}>
          {children}
        </DataProvider>
      </ProjectsClientContext.Provider>
    </div>
  );
}
