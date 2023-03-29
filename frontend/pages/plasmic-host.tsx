import { PLASMIC } from "../plasmic-init";
import { PlasmicCanvasHost } from "@plasmicapp/loader-nextjs";
import * as React from "react";

export default function PlasmicHost() {
  return PLASMIC && <PlasmicCanvasHost />;
}
