export interface State<T> {
  data?: T;
  error?: Error;
}

// discriminated union type
export type Action<T> =
  | { type: "loading" }
  | { type: "fetched"; payload: T }
  | { type: "error"; payload: Error };
