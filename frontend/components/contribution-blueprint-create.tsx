import { useListRegistries } from "../hooks/list-registries";
import { Button, Divider } from "@mui/material";
import { useState } from "react";
import { AddRegistryDialog } from "./add-registry-dialog";

export const ContributionBlueprintCreate = () => {
  const { data } = useListRegistries();
  const [showAddRegistryDialog, setShowAddRegistryDialog] = useState(false);
  return (
    <div>
      <Button onClick={() => setShowAddRegistryDialog(true)}>
        Add registry
      </Button>
      {data?.map((registry: any) => (
        <div key={registry.id}>
          <h2>{registry.name}</h2>
          <p>{registry.description}</p>
          <p>{registry.owner_address}</p>
          <Divider />
        </div>
      ))}
      <AddRegistryDialog
        open={showAddRegistryDialog}
        onClose={() => setShowAddRegistryDialog(false)}
      />
    </div>
  );
};
