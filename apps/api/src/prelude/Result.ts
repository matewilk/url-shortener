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

type Cases<T, E, A> = {
  onOk: (result: T) => A;
  onErr: (error: E) => A;
};

export const match = <T, E, A>(result: Result<T, E>, cases: Cases<T, E, A>) => {
  if (result.kind === "success") {
    return cases.onOk(result.value);
  } else {
    return cases.onErr(result.error);
  }
};

export const flatMapAsyncW = <T, E, U, E1>(
  result: Result<T, E>,
  fn: (value: T) => Promise<Result<U, E | E1>>
): Promise<Result<U, E | E1>> => {
  return result.kind === "success"
    ? fn(result.value)
    : Promise.resolve(err(result.error));
};

export const taggedError = <Tag extends string>(tag: Tag) =>
  class extends Error {
    tag: Tag = tag;
  };

type TagCases<E extends { tag: string }, A> = {
  [K in E["tag"]]: (value: Extract<E, { tag: K }>) => A;
};

export const matchErrorTag = <E extends { tag: string }, A>(
  value: E,
  cases: TagCases<E, A>
): A => {
  // @ts-expect-error
  return cases[value.tag](value);
};
