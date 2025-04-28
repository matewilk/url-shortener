"use server";
import { z } from "zod";

import { client } from "@shortify/api-client/client";
import { RemoteResult } from "@/prelude/RemoteResult";
const apiClient = client("http://localhost:3001");

interface SubmitUrlAction {
  (prevState: unknown, formData: FormData): Promise<
    RemoteResult<{ message: string }, { message: string }>
  >;
}

export const submitUrl: SubmitUrlAction = async (
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

    // TODO: this apiClinet returns wrong types
    const { data, error } = await apiClient.POST("/shorten", {
      body: {
        url,
      },
    });

    if (error) {
      return {
        kind: "error",
        error: { message: "Internal server error." },
      };
    }

    return {
      kind: "success",
      value: { message: `${data?.shortUrl}` },
    };
  } catch (error) {
    return {
      kind: "error",
      error: { message: "Please enter a valid URL and try again." },
    };
  }
};
