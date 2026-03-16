export type ImportResult<T = null> = {
  inserted: number;
  skipped: number;
  errors: Error[];
  data: T;
};

export type SiteWithCity = {
  id: number;
  city: { name: string };
};
