import React from "react";
import { DataProvider } from "@plasmicapp/loader-nextjs";
import { GRAPH_URL, SUPABASE_TABLE } from "../lib/config";

const PLASMIC_DATA_KEY = "Config";

interface ConfigData {
  graphUrl: string;
  supabaseTable: string;
}

export interface ConfigProps {
  className?: string; // Plasmic CSS class
  children?: React.ReactNode;
}

export function Config(props: ConfigProps) {
  const { className, children } = props;
  const data: ConfigData = {
    graphUrl: GRAPH_URL,
    supabaseTable: SUPABASE_TABLE,
  };
  return (
    <div className={className}>
      <DataProvider name={PLASMIC_DATA_KEY} data={data}>
        {children}
      </DataProvider>
    </div>
  );
}
