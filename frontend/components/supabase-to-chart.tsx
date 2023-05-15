import { DataProvider } from "@plasmicapp/loader-nextjs";
import dayjs from "dayjs";
import _ from "lodash";
import React, { ReactNode } from "react";
import { spawn } from "../lib/common";
import { supabase } from "../lib/supabase-client";

// The name used to pass data into the Plasmic DataProvider
const DATAPROVIDER_NAME = "supabaseChart";

/**
 * Supabase query component focused on providing data to a `Chart` component
 *
 * Current limitations:
 * - Does not support authentication or RLS. Make sure data is readable by unauthenticated users
 */
export interface SupabaseToChartProps {
  className?: string; // Plasmic CSS class
  variableName?: string; // Name to use in Plasmic data picker
  children?: ReactNode; // Show this
  loading?: ReactNode; // Show during loading if !ignoreLoading
  ignoreLoading?: boolean; // Skip the loading visual
  githubOrgs?: string[];
  eventTypes?: string[];
  startDate?: string;
  endDate?: string;
}

export function SupabaseToChart(props: SupabaseToChartProps) {
  // These props are set in the Plasmic Studio
  const {
    className,
    variableName,
    children,
    loading,
    ignoreLoading,
    githubOrgs,
    eventTypes,
    startDate,
    endDate,
  } = props;
  const [result, setResult] = React.useState<any[] | undefined>(undefined);

  // Only query if the user is logged in
  React.useEffect(() => {
    spawn(
      (async () => {
        try {
          //const startDateObj = new Date(startDate ?? 0);
          //const endDateObj = endDate ? new Date(endDate) : new Date();
          const { data, error, status } = await supabase
            .from("events")
            .select(
              "id, project:project_id!inner(id, github_org), event_type, timestamp, amount, details",
            )
            .limit(10000)
            .in("project.github_org", githubOrgs ?? [])
            .in("event_type", eventTypes ?? []);
          //.gte("timestamp", startDateObj.toISOString())
          //.lte("timestamp", endDateObj.toISOString());

          if (error && status !== 406) {
            throw error;
          } else if (!data) {
            throw new Error("Missing data");
          }
          console.log(data);

          const simpleDates = data.map((x) => ({
            date: dayjs(x.timestamp).format("YYYY-MM-DD"),
            amount: x.amount,
          }));
          console.log(simpleDates);
          const grouped = _.groupBy(simpleDates, (x) => x.date);
          console.log(grouped);
          const summed = _.mapValues(grouped, (x) =>
            _.sum(x.map((y) => y.amount)),
          );
          console.log(summed);
          const unsorted = _.toPairs(summed).map((x) => ({
            date: x[0],
            value: x[1],
          }));
          const result = _.sortBy(unsorted, (x) => x.date);
          console.log(result);
          setResult(result);
        } catch (error) {
          // Just log query errors at the moment
          console.error(error);
        }
      })(),
    );
  }, [githubOrgs, eventTypes, startDate, endDate]);

  // Show when loading
  if (!ignoreLoading && !!loading && !result) {
    return <div className={className}> {loading} </div>;
  }

  return (
    <div className={className}>
      <DataProvider name={variableName ?? DATAPROVIDER_NAME} data={result}>
        {children}
      </DataProvider>
    </div>
  );
}
