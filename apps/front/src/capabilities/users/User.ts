import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(4),
  confirmPassword: z.string().min(4),
});

type KnownUser = {
  kind: "known";
  email: string;
  name: string;
};

type GuestUser = {
  kind: "guest";
};

export type User = KnownUser | GuestUser;
