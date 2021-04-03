export interface Paginated<T = unknown> {
  count: number;
  results: T[];
}
