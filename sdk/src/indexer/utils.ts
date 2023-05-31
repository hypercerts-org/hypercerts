export type QueryParams = {
  orderDirections: "asc" | "desc";
  skip: number;
  first: number;
  [key: string]: any;
};

export const defaultQueryParams: QueryParams = {
  orderDirections: "desc",
  skip: 0,
  first: 100,
};
