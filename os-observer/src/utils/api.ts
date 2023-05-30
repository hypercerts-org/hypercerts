import { ADT } from "ts-adt";

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
