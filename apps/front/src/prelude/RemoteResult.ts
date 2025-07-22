interface OK<V> {
  kind: "success";
  value: V;
}

export const ok = <V>(value: V): RemoteResult<V, never> => ({
  kind: "success",
  value,
});

interface Err<E> {
  kind: "error";
  error: E;
}

export const err = <E>(error: E): RemoteResult<never, E> => ({
  kind: "error",
  error,
});

export interface Init {
  kind: "init";
}

export type RemoteResult<T, E> = Init | OK<T> | Err<E>;
