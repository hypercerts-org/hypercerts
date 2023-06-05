import React, { useRef, useEffect } from "react";
import { Runtime, Inspector } from "@observablehq/runtime";
import notebook from "c857fa5c110524ee";

export function ZuzaluHypercertTreemap() {
  const chartRef = useRef();
  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(notebook, (name) => {
      if (name === "chart") return new Inspector(chartRef.current);
    });
    return () => runtime.dispose();
  }, []);

  return <>Credit: Zuzualu hypercerts by category by hypercerts</>;
}
