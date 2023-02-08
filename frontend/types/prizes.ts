export type EvaluationType = "quadratic-voting" | null;

export interface Link {
  url: string;
  title: string;
}

export interface Evaluator {
  id: string;
  details: {
    credits: number;
    __type__: string;
  };
}

export interface Outcome {
  id: string;
  details: {
    id: string;
    links: Link[];
    title: string;
    __type__: string;
    description: string;
  };
}

export interface TimePeriod {
  start_date?: string;
  end_date?: string;
}

export interface Round {
  evaluation_id: string;
  tenant_id: string;
  title: string;
  description?: string;
  evaluation_type?: EvaluationType;
  evaluation_period?: TimePeriod;
  archived: boolean;
  evaluators: Evaluator[];
  outcomes: Outcome[];
}
