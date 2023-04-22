import { spawn } from "../lib/common";
import { supabase } from "../lib/supabase-client";
import { DataProvider } from "@plasmicapp/loader-nextjs";
import React, { ReactNode } from "react";

// The name used to pass data into the Plasmic DataProvider
const DATAPROVIDER_NAME = "supabaseData";

/**
 * Generic Supabase query component.
 *
 * Current limitations:
 * - Does not support authentication or RLS. Make sure data is readable by unauthenticated users
 */
export interface SupabaseQueryProps {
  className?: string; // Plasmic CSS class
  children?: ReactNode; // Show this
  tableName?: string; // table to query
  columns?: string; // comma-delimited column names (e.g. `address,claimId`)
  filters?: any; // A list of filters, where each filter is `[ column, operator, value ]`
  // See https://supabase.com/docs/reference/javascript/filter
  // e.g. [ [ "address", "eq", "0xabc123" ] ]
  limit?: number; // Number of results to return
  orderBy?: string; // Name of column to order by
  orderAscending?: boolean; // True if ascending, false if descending
}

export function SupabaseQuery(props: SupabaseQueryProps) {
  // These props are set in the Plasmic Studio
  const {
    className,
    children,
    tableName,
    columns,
    filters,
    limit,
    orderBy,
    orderAscending,
  } = props;
  const [result, setResult] = React.useState<any[] | undefined>(undefined);

  // Only query if the user is logged in
  React.useEffect(() => {
    // Short circuit if the user hasn't specified a table to query from
    if (!tableName) {
      return;
    }
    spawn(
      (async () => {
        try {
          let query = supabase.from(tableName).select(columns);
          // Iterate over the filters
          if (Array.isArray(filters)) {
            for (let i = 0; i < filters.length; i++) {
              const f = filters[i];
              if (!Array.isArray(f) || f.length < 3) {
                console.warn(`Invalid supabase filter: ${f}`);
                continue;
              }
              query = query.filter(f[0], f[1], f[2]);
            }
          }
          if (limit) {
            query = query.limit(limit);
          }
          if (orderBy) {
            query = query.order(orderBy, { ascending: orderAscending });
          }
          // Execute query
          const { data, error, status } = await query;
          if (error && status !== 406) {
            throw error;
          } else if (data) {
            setResult(data);
          }
        } catch (error) {
          // Just log query errors at the moment
          console.error(error);
        }
      })(),
    );
  }, [tableName, columns, filters]);

  // Error messages are currently rendered in the component
  if (!tableName) {
    return <p>You need to set the tableName prop</p>;
  } else if (!columns) {
    return <p>You need to set the columns prop</p>;
  }

  return (
    <div className={className}>
      <DataProvider name={DATAPROVIDER_NAME} data={result}>
        {children}
      </DataProvider>
    </div>
  );
}
