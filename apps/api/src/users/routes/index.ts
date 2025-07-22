import { Request, Response } from "express";

import { Route } from "@/Routes";
import { UserService } from "../service/UserService";
import { baseUserSchema } from "@/users//User";
import { err, match, matchErrorTag, ok } from "@/prelude/Result";

type UserRouteServices = {
  userService: UserService;
};

const registerUserSchema = baseUserSchema.omit({ id: true });

export const registerUser: Route<UserRouteServices> = async (
  req,
  res,
  { userService }
): Promise<Response> => {
  const { name, email, password } = registerUserSchema.parse(req.body);

  const result = await userService.register({
    name,
    email,
    password,
  });

  return match(result, {
    onOk: (value) => res.status(201).json({ user: value }),
    onErr: (error) =>
      matchErrorTag(error, {
        AlreadyExists: (error) =>
          res.status(409).json({ error: "User already exists" }),
      }),
  });
};

const loginUserSchema = baseUserSchema.pick({ email: true, password: true });

export const loginUser: Route<UserRouteServices> = async (
  req: Request,
  res: Response,
  { userService }
): Promise<Response> => {
  const { email, password } = loginUserSchema.parse(req.body);

  const result = await userService.login(email, password);

  return match(result, {
    onOk: (token) => res.json({ token }),
    onErr: () => res.status(401).json({ error: "Unauthorized" }),
  });
};

const findByIdSchema = baseUserSchema.pick({ id: true });

export const findUserById: Route<UserRouteServices> = async (
  req: Request,
  res: Response,
  { userService }
): Promise<Response> => {
  const { id } = findByIdSchema.parse(req.params);

  const result = await userService.findById(Number(id));

  return match(result, {
    onOk: (value) => res.json({ user: value }),
    onErr: (error) =>
      matchErrorTag(error, {
        NotFound: (error) => res.status(404).json({ error: "User not found" }),
      }),
  });
};

const findByEmailSchema = baseUserSchema.pick({ email: true });

export const findUserByEmail: Route<UserRouteServices> = async (
  req: Request,
  res: Response,
  { userService }
) => {
  const { email } = findByEmailSchema.parse(req.params);

  const result = await userService.findByEmail(email);

  return match(result, {
    onOk: (value) => res.json({ user: value }),
    onErr: (error) =>
      matchErrorTag(error, {
        NotFound: (error) => res.status(404).json({ error: "User not found" }),
      }),
  });
};

const updateUserParamsSchema = baseUserSchema.pick({ id: true });
const updateUserBodySchema = baseUserSchema.omit({ id: true }).partial();

export const updateUser: Route<UserRouteServices> = async (
  req: Request,
  res: Response,
  { userService }
): Promise<Response> => {
  const { id } = updateUserParamsSchema.parse(req.params);
  const { name, email, password } = updateUserBodySchema.parse(req.body);

  const result = await userService.update(id, {
    name,
    email,
    password,
  });

  return match(result, {
    onOk: (value) => res.json({ user: value }),
    onErr: (error) =>
      matchErrorTag(error, {
        NotFound: () => res.status(404).json({ error: "User not found" }),
        AlreadyExists: () =>
          res.status(409).json({ error: "User already exists" }),
      }),
  });
};

const deleteUserSchema = baseUserSchema.pick({ id: true });

export const deleteUser: Route<UserRouteServices> = async (
  req: Request,
  res: Response,
  { userService }
): Promise<Response> => {
  const { id } = deleteUserSchema.parse(req.params);

  await userService.delete(id);

  return res.send(204);
};
