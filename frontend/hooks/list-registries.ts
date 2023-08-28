import { supabase } from "../lib/supabase-client";
import { useQuery } from "@tanstack/react-query";

interface Registry {
  id: string;
  description: string;
  name: string;
  owner_address: string;
}

export const useListRegistries = () => {
  return useQuery(["registries"], async () => {
    return supabase
      .from("registries-optimism")
      .select("*")
      .then((res) => {
        if (res.error) {
          throw res.error;
        }
        return res.data as Registry[];
      });
  });
};
