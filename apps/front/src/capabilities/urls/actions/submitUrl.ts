"use server";

import { z } from "zod";

import { RemoteResult } from "@/prelude/RemoteResult";
import { Capabilities } from "@/capabilities/Capabilities";

interface SubmitUrlAction {
  (prevState: unknown, formData: FormData, capabilities: Capabilities): Promise<
    RemoteResult<{ message: string }, { message: string }>
  >;
}

export const submitUrl: SubmitUrlAction = async (
  prevState: unknown,
  formData: FormData,
  capabilities: Capabilities
) => {
  const schema = z.object({
    url: z.string().url(),
  });

  try {
    const { url } = schema.parse({
      url: formData.get("url"),
    });

    // TODO: this apiClinet returns wrong types
    const { data, error } = await capabilities.apiClient.POST("/shorten", {
      body: {
        url,
      },
      headers: {
        Authorization: `Bearer ${capabilities.user.token}`,
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
