import { useQuery } from "@tanstack/react-query";
import { SHEET_BEST_ENDPOINT } from "../lib/config";
import { toast } from "react-toastify";

export const useWorkScopes = () => {
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
        toast("Could not fetch WorkScopes collections", { type: "error" });
      },
    },
  );
};
