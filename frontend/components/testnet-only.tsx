import { isProduction } from "../lib/config";
import React from "react";

export const TestnetOnly = ({ children }: React.PropsWithChildren) => {
  if (isProduction) {
    return null;
  }

  return <>{children}</>;
};
