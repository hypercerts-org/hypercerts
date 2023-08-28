import { supabase } from "../lib/supabase-client";
import { useMutation } from "wagmi";

export const useMintBlueprintToRegistry = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  return useMutation(
    ["mintBlueprintToRegistry"],
    async ({
      registryId,
      minterAddress,
      value,
    }: {
      registryId: string;
      minterAddress: string;
      value: string;
    }) => {
      supabase
        .from("claim-blueprints-optimism")
        .insert({
          registry_id: registryId,
          minter_address: minterAddress,
          form_values: value,
        })
        .then((res) => {
          if (res.error) {
            throw res.error;
          }
          return true;
        });
    },
  );
};
