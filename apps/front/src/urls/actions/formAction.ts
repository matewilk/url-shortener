"use server";
import { z } from "zod";

import { client } from "@shortify/api-client/client";
const apiClient = client("http://localhost:3001");

export const submitUrlAction = async (
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
        message: "Internal server error",
      };
    }

    return {
      message: `Form submitted with ${data?.shortUrl}`,
    };
  } catch (error) {
    return {
      message: "Invalid URL",
    };
  }
};
