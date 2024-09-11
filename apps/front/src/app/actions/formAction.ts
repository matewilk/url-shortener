"use server";
import { z } from "zod";

export const formSubmitAction = async (
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

    return {
      message: `Form submitted with ${url}`,
    };
  } catch (error) {
    return {
      message: "Invalid URL",
    };
  }
};
