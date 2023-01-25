import { SHEET_BEST_ENDPOINT } from "../constants";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "./toast";

export const useWorkScopes = () => {
  const toast = useToast();
  const searchParams = new URLSearchParams();
  searchParams.set("_format", "list");

  const url = `${SHEET_BEST_ENDPOINT}/tabs/WorkScopes?${searchParams}`;
  return useQuery(
    ["sheets", "workScopes"],
    () =>
      fetch(url)
        .then(async (res) => (await res.json()) as { value: string[] })
        .then((res) => res.value),
    {
      cacheTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      onError: () => {
        toast({
          status: "error",
          description: "Could not fetch WorkScopes collections",
        });
      },
    }
  );
};
