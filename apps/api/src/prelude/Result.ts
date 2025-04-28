export type Result<T, E> = Ok<T> | Err<E>;

export type Ok<T> = {
  kind: "success";
  value: T;
};

export const ok = <T, E>(value: T): Result<T, E> => ({
  kind: "success",
  value,
});

export type Err<E> = {
  kind: "error";
  error: E;
};

export const err = <T, E>(error: E): Result<T, E> => ({
  kind: "error",
  error,
});
