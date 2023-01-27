import React, { ReactNode, useContext } from "react";
import { DataProvider, repeatedElement } from '@plasmicapp/loader-nextjs';
import { useAsync } from 'react-use';
import { ClientContext } from "./contexts";

const ROW_SELECTOR = "currentRow";

export interface ClientGridProps {
  className?: string;       // Plasmic CSS class
  method?: string;           // Which method to call off the client
  children?: ReactNode;     // ReactNode per element
  loadingChildren?: ReactNode; // ReactNode to show when loading
  testLoading?: boolean;   // Always show the loading state
  count?: number;           // Limit to `count` results
}
export function ClientGrid(props: ClientGridProps) {
  const {
    className,
    method,
    children,
    loadingChildren,
    testLoading: forceLoading,
    count,
  } = props;
  const client = useContext(ClientContext);
  const results = useAsync(async () => {
    switch (method) {
      case "getRounds":
        return await client.getRounds();
      default:
        return [];
    }
  }, []);

  if (!method) {
    return <>Invalid method</>;
  } else if (results.loading || !results.value || forceLoading) {
    return <>loadingChildren</>;
  }

  const showResults = results.value.slice(0, count);
  return (
    <div className={className}>
      {showResults.map((row: any, i: any) => (
        <DataProvider name={ROW_SELECTOR} data={row} key={row.id}>
          {repeatedElement(i, children)}
        </DataProvider>
      ))}
    </div>
  );
}
