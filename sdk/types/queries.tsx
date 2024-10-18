export type BaseQueryFilter = {
  id: string;
  value: string | number | boolean;
  join?: "AND" | "OR";
  condition?: "NOT";
};

export type BaseSortingFilter = {
  id: string;
  desc: boolean;
};
