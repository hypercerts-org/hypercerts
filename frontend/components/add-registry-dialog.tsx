import {
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
} from "@mui/material";
import { Formik } from "formik";

export const AddRegistryDialog = (props: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogTitle>Add registry</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            name: undefined as string | undefined,
            description: undefined as string | undefined,
            owner_address: undefined as string | undefined,
          }}
          onSubmit={(data) => {
            console.log(data);
          }}
        >
          {({ handleSubmit }) => (
            <form
              style={{ display: "flex", flexDirection: "column" }}
              onSubmit={handleSubmit}
            >
              <label htmlFor="name">Name</label>
              <input name="name" type="text" />
              <label htmlFor="description">Description</label>
              <textarea name="description" />
              <label htmlFor="owner_address">Owner address</label>
              <input name="owner_address" type="text" />
              <Button type="submit">Create</Button>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
