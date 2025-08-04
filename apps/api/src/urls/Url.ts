import z from "zod";

export const urlSchema = z.object({
  url: z.string().url(),
});

export const shortUrlSchema = z.object({
  shortUrl: z.string().min(1),
});
