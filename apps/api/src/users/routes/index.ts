import { Request, Response } from "express";
import { z } from "zod";

import { Route } from "@/Routes";
import { UserService } from "../service/UserService";
import { ErrorHandler } from "@/error";

type UserRouteServices = {
  userService: UserService;
  errorHandler: ErrorHandler;
};

const idSchema = z.coerce.number();
const nameSchema = z.string().min(3);
const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);

const baseUserSchema = z.object({
  id: idSchema,
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

const registerUserSchema = baseUserSchema.omit({ id: true });

export const registerUser: Route<UserRouteServices> = async (
  req,
  res,
  { userService }
): Promise<Response> => {
  try {
    const { name, email, password } = registerUserSchema.parse(req.body);

    const response = await userService.register({
      name,
      email,
      password,
    });

    return res.json({ user: response });
  } catch (error) {
    throw error;
  }
};

const loginUserSchema = baseUserSchema.pick({ email: true, password: true });

export const loginUser: Route<UserRouteServices> = async (
  req: Request,
  res: Response,
  { userService }
): Promise<Response> => {
  try {
    const { email, password } = loginUserSchema.parse(req.body);

    const response = await userService.login(email, password);

    return res.json({ token: response });
  } catch (error) {
    throw error;
  }
};

const findByIdSchema = baseUserSchema.pick({ id: true });

export const findUserById: Route<UserRouteServices> = async (
  req: Request,
  res: Response,
  { userService }
): Promise<Response> => {
  try {
    const { id } = findByIdSchema.parse(req.params);

    const response = await userService.findById(Number(id));

    return res.json({ user: response });
  } catch (error) {
    throw error;
  }
};

const findByEmailSchema = baseUserSchema.pick({ email: true });

export const findUserByEmail: Route<UserRouteServices> = async (
  req: Request,
  res: Response,
  { userService }
) => {
  try {
    const { email } = findByEmailSchema.parse(req.params);

    const response = await userService.findByEmail(email);

    return res.json({ user: response });
  } catch (error) {
    throw error;
  }
};

const updateUserParamsSchema = baseUserSchema.pick({ id: true });
const updateUserBodySchema = baseUserSchema.omit({ id: true }).partial();

export const updateUser: Route<UserRouteServices> = async (
  req: Request,
  res: Response,
  { userService }
): Promise<Response> => {
  try {
    const { id } = updateUserParamsSchema.parse(req.params);
    const { name, email, password } = updateUserBodySchema.parse(req.body);

    const response = await userService.update(id, {
      name,
      email,
      password,
    });

    return res.json({ user: response });
  } catch (error) {
    throw error;
  }
};

const deleteUserSchema = baseUserSchema.pick({ id: true });

export const deleteUser: Route<UserRouteServices> = async (
  req: Request,
  res: Response,
  { userService }
): Promise<Response> => {
  try {
    const { id } = deleteUserSchema.parse(req.params);

    await userService.delete(id);

    return res.send(204);
  } catch (error) {
    throw error;
  }
};
