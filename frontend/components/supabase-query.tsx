import React, { ReactNode } from "react";
import { DataProvider } from "@plasmicapp/loader-nextjs";
import { supabase } from "../lib/supabase-client";
import { spawn } from "../lib/common";

// The name used to pass data into the Plasmic DataProvider
const DATAPROVIDER_NAME = "supabaseData";

export interface SupabaseQueryProps {
  className?: string;
  children?: ReactNode;
  tableName?: string;
  columns?: string;
  filters?: any;
}

export function SupabaseQuery(props: SupabaseQueryProps) {
  // These props are set in the Plasmic Studio
  const { className, children, tableName, columns, filters } = props;
  const [result, setResult] = React.useState<any[] | undefined>(undefined);

  // Only query if the user is logged in
  React.useEffect(() => {
    if (!tableName) {
      return;
    }
    spawn((async () => {
      try {
        const cols = columns ? columns + ",id" : "id";
        let query = supabase.from(tableName).select(cols);
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
        const { data, error, status } = await query.order("id", { ascending: false });
        if (error && status !== 406) {
          throw error;
        } else if (data) {
          setResult(data);
        }
      } catch (error) {
        // Just log query errors at the moment
        console.log(error);
      }
    })());
  }, [tableName, columns, filters ]);

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
