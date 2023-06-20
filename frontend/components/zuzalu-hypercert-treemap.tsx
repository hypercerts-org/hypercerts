import React, { useRef, useEffect, ReactNode } from "react";
import { Runtime, Inspector } from "@observablehq/runtime";
import notebook from "@hypercerts-org/observabletreemap";

export interface ZuzaluHypercertTreemapProps {
  className?: string;
  children?: ReactNode;
}

const defaultChildren = (
  <p>
    Credit:
    <a href="https://observablehq.com/d/c857fa5c110524ee">
      Zuzualu hypercerts by category by hypercerts
    </a>
  </p>
);

export function ZuzaluHypercertTreemap(props: ZuzaluHypercertTreemapProps) {
  const { className, children } = props;
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(notebook, (name) => {
      if (name === "chart") return new Inspector(chartRef.current);
    });
    return () => runtime.dispose();
  }, []);

  return (
    <div className={className}>
      <div ref={chartRef} />
      {children ?? defaultChildren}
    </div>
  );
}
