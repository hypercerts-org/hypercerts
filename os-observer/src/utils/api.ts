import { ADT } from "ts-adt";

export interface CommonArgs {
  // Auto-respond yes to any user-prompts (useful for CI)
  yes?: boolean;
  // Mark the query for auto-crawling
  // Note: we currently ignore this when false, only updating the column when true
  autocrawl?: boolean;
}

export interface ApiInterface<Args> {
  command: string;
  func: EventSourceFunction<Args>;
}

export interface EventSourceFunction<Args> {
  (args: Args): Promise<ApiReturnType>;
}

export type ApiReturnType = ADT<{
  // Signals that there was nothing to retrieve
  upToDate: { cached: true };
  // Signals that we had to retrieve `count` events the the source
  success: { count: number };
  // Signals that we partially retrieved some data, but go stuck at a rate-limit
  rateLimited: { count: number };
  // Signals that we encountered an error
  error: { e: Error };
}>;
