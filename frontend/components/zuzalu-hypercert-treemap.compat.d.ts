// Provided for the zuzalu-hypercert-treemap.

type notebook = unknown;

declare module "@observablehq/runtime" {
  declare class Runtime {
    module(
      notebook: notebook,
      fn: (name: string) => Inspector | undefined,
    ): RuntimeModule;
    dispose();
  }

  declare class RuntimeModule {
    redefine(target: string, value: any);
  }
  declare class Inspector {
    constructor(chartRef: any);
  }
}

declare module "@hypercerts-org/observabletreemap" {
  export const notebook: notebook;
}
