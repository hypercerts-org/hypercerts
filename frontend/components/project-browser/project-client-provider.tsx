import React, { ReactNode } from "react";
import { DataProvider } from "@plasmicapp/loader-nextjs";
import { RawCollection } from "../../lib/data-table";
import {
  fakeDataGenerator,
  FakeProjectsClient,
  IProjectsClient,
  NullProjectsClient,
  ProjectFilters,
  ProjectViewsCollection,
  RandomTestProjectsClient,
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
      const data = testData
        ? testData
        : { filterOptions: [], projects: ProjectViewsCollection.empty() };
      console.log("loading test data");
      setClient(
        RandomTestProjectsClient.loadFromRaw(
          10,
          data.filterOptions,
          data.projects,
        ),
      );
    } else {
      //setClient(new ProjectsClient());
      //setClient(RandomTestProjectsClient.loadFromRaw(10));
      setClient(FakeProjectsClient.fromFakeConfig(fakeDataGenerator()));
    }
  }, [useTestData, testData]);

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
