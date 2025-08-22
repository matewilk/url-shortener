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

    const shortUrl = await capabilities.urls.shorten(url);

    if (!shortUrl) {
      return {
        kind: "error",
        error: { message: "Internal server error." },
      };
    }

    return {
      kind: "success",
      value: { message: `${shortUrl}` },
    };
  } catch (error) {
    return {
      kind: "error",
      error: { message: "Please enter a valid URL and try again." },
    };
  }
};
