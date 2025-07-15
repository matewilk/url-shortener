import { z } from "zod";

import { taggedError } from "@/prelude/Result";

const idSchema = z.coerce.number();
const nameSchema = z.string().min(3);
const emailSchema = z.string().email();
const passwordSchema = z.string().min(4);

export const baseUserSchema = z.object({
  id: idSchema,
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type User = z.infer<typeof baseUserSchema>;

export namespace User {
  export type Draft = Omit<User, "id">;
  export type Patch = Partial<Draft>;
  export type Return = Omit<User, "password">; // | "email"

  export class NotFound extends taggedError("NotFound") {}
  export class AlreadyExists extends taggedError("UserAlreadyExists") {}

  export type UpdateError = NotFound | AlreadyExists;
}
