import React, { useRef, useEffect, ReactNode } from "react";
import { Runtime, Inspector } from "@observablehq/runtime";
import notebook from "@hypercerts-org/observabletreemap";

export interface GenericHypercertTreemapProps {
  className?: string;
  children?: ReactNode;
  backgroundImageUrl?: string;
  data: object;
}

const defaultChildren = (
  <p>
    Credit:
    <a href="https://observablehq.com/d/c857fa5c110524ee">
      Zuzualu hypercerts by category by hypercerts
    </a>
  </p>
);

export function GenericHypercertTreemap(props: GenericHypercertTreemapProps) {
  const { className, children, data, backgroundImageUrl } = props;
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const runtime = new Runtime();
    const main = runtime.module(notebook, (name) => {
      if (name === "chart") {
        return new Inspector(chartRef.current);
      }
    });
    main.redefine("data", data);

    // Keeping this here for now because we'd like to get background images
    //working if we can fix the rendering. The value passed into observable
    //needs to be an HTMLImageElement. So the commented code doesn't exactly
    //work yet.
    //main.redefine("zuzaluLogo400x600", backgroundImageUrl);
    return () => runtime.dispose();
  }, []);

  return (
    <div className={className}>
      <div ref={chartRef} />
      {children ?? defaultChildren}
    </div>
  );
}
