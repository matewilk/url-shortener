interface OK<V> {
  kind: "success";
  value: V;
}

interface Err<E> {
  kind: "error";
  error: E;
}

export interface Init {
  kind: "init";
}

export type RemoteResult<T, E> = Init | OK<T> | Err<E>;
