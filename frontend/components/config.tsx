import { useHypercertClient } from "../hooks/hypercerts-client";
import { DOMAIN, SUPABASE_TABLE } from "../lib/config";
import { DataProvider } from "@plasmicapp/loader-nextjs";
import React from "react";

const PLASMIC_DATA_KEY = "Config";

interface ConfigData {
  domain: string;
  chainId?: number;
  graphUrl?: string;
  supabaseTable: string;
}

export interface ConfigProps {
  className?: string; // Plasmic CSS class
  children?: React.ReactNode;
}

export function Config(props: ConfigProps) {
  const { className, children } = props;
  const { client: hypercertClient } = useHypercertClient();
  const chainId = hypercertClient.config.chain?.id
    ? Number(hypercertClient.config.chain.id)
    : undefined;

  console.log(chainId);
  console.log("Config: ", hypercertClient.config);

  const data: ConfigData = {
    domain: DOMAIN,
    chainId: chainId,
    graphUrl: hypercertClient?.config.graphUrl,
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
