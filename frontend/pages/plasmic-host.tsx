import { PLASMIC } from "../plasmic-init";
import { PlasmicCanvasHost } from "@plasmicapp/loader-nextjs";
import * as React from "react";
import DappContext from "../components/dapp-context";

export default function PlasmicHost() {
  return (
    PLASMIC && (
      <DappContext>
        <PlasmicCanvasHost />
      </DappContext>
    )
  );
}
