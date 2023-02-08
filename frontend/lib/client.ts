import { supabaseQuery } from "./supabase-client";

const ROUND_TABLE = "evaluations";

export type ClientConfig = {
  // eslint-disable-line
};

export default class Client {
  constructor(private config: ClientConfig) {}

  public async getRounds(): Promise<any[]> {
    return supabaseQuery({
      table: ROUND_TABLE,
    });
  }
}
