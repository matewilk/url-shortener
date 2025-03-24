import { Request, Response } from "express";
import { z } from "zod";

import { Route } from "@/Routes";
import { UserServiceType } from "../service/UserService";
import { ErrorHandler } from "@/error";

type UserRouteServices = {
  userService: UserServiceType;
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
  { userService, errorHandler }
): Promise<Response> => {
  try {
    const { name, email, password } = registerUserSchema.parse(req.body);

    const response = await userService.register({
      name,
      email,
      password,
    });

    if (response instanceof Error) {
      return errorHandler.handleError(response, res);
    }

    return res.json({ user: response });
  } catch (error) {
    return errorHandler.handleError(error as Error, res);
  }
};

const loginUserSchema = baseUserSchema.pick({ email: true, password: true });

export const loginUser: Route<UserRouteServices> = async (
  req: Request,
  res: Response,
  { userService, errorHandler }
): Promise<Response> => {
  try {
    const { email, password } = loginUserSchema.parse(req.body);

    const response = await userService.login(email, password);

    if (response instanceof Error) {
      return errorHandler.handleError(response, res);
    }

    return res.json({ token: response });
  } catch (error) {
    return errorHandler.handleError(error as Error, res);
  }
};

const findByIdSchema = baseUserSchema.pick({ id: true });

export const findUserById: Route<UserRouteServices> = async (
  req: Request,
  res: Response,
  { userService, errorHandler }
): Promise<Response> => {
  try {
    const { id } = findByIdSchema.parse(req.params);

    const response = await userService.findById(Number(id));

    if (response === null) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: response });
  } catch (error) {
    return errorHandler.handleError(error as Error, res);
  }
};

const findByEmailSchema = baseUserSchema.pick({ email: true });

export const findUserByEmail: Route<UserRouteServices> = async (
  req: Request,
  res: Response,
  { userService, errorHandler }
) => {
  try {
    const { email } = findByEmailSchema.parse(req.params);

    const response = await userService.findByEmail(email);

    if (response === null) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: response });
  } catch (error) {
    return errorHandler.handleError(error as Error, res);
  }
};

const updateUserParamsSchema = baseUserSchema.pick({ id: true });
const updateUserBodySchema = baseUserSchema.omit({ id: true }).partial();

export const updateUser: Route<UserRouteServices> = async (
  req: Request,
  res: Response,
  { userService, errorHandler }
): Promise<Response> => {
  try {
    const { id } = updateUserParamsSchema.parse(req.params);
    const { name, email, password } = updateUserBodySchema.parse(req.body);

    const response = await userService.update(id, {
      name,
      email,
      password,
    });

    if (response instanceof Error) {
      return errorHandler.handleError(response, res);
    }

    return res.json({ user: response });
  } catch (error) {
    return errorHandler.handleError(error as Error, res);
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
