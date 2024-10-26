"use server";
import { z } from "zod";

import { client } from "@shortify/api-client/client";
const apiClient = client("http://localhost:3001");

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

type Result<T, E> = Init | OK<T> | Err<E>;

interface SubmitUrlAction {
  (prevState: unknown, formData: FormData): Promise<
    Result<{ message: string }, { message: string }>
  >;
}

export const submitUrlAction: SubmitUrlAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const schema = z.object({
    url: z.string().url(),
  });

  try {
    const { url } = schema.parse({
      url: formData.get("url"),
    });

    const { data, error } = await apiClient.POST("/shorten", {
      body: {
        url,
      },
    });

    if (error) {
      return {
        kind: "error",
        error: { message: "Internal server error" },
      };
    }

    return {
      kind: "success",
      value: { message: `Form submitted with ${data?.shortUrl}` },
    };
  } catch (error) {
    return {
      kind: "error",
      error: { message: "Invalid URL" },
    };
  }
};
