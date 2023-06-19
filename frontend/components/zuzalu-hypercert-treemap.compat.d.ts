// Provided for the zuzalu-hypercert-treemap.

type notebook = unknown;

declare module "@observablehq/runtime" {
  declare class Runtime {
    module(notebook: notebook, fn: (name: string) => Inspector | undefined);
    dispose();
  }
  declare class Inspector {
    constructor(chartRef: any);
  }
}

declare module "@hypercerts-org/observabletreemap" {
  export const notebook: notebook;
}
