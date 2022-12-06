import { Round } from "../types/prizes";
import { supabaseQuery } from "./supabaseClient";

const ROUND_TABLE = "evaluations";

export type ClientConfig = {
};

export default class Client {

  constructor(private config: ClientConfig) {
  }

  public async getRounds(): Promise<any[]> {
    return supabaseQuery({
      table: ROUND_TABLE,
    });
  }
  
}