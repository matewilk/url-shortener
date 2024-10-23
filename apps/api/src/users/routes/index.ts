import { Request, Response } from "express";
import { z } from "zod";

import { Route } from "../../Routes";
import { UserServiceType } from "../service/UserService";
import { ErrorHandler } from "../../error";

type UserRouteServices = {
  userService: UserServiceType;
  errorHandler: ErrorHandler;
};

const registerUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

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

const findByIdSchema = z.object({
  id: z.coerce.number(),
});

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

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

const findByEmailSchema = z.object({
  email: z.string().email(),
});

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

const updateUserParamsSchema = z.object({
  id: z.coerce.number(),
});

const updateUserBodySchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
});

export const updateUser: Route<UserRouteServices> = async (
  req: Request,
  res: Response,
  { userService, errorHandler }
): Promise<Response> => {
  try {
    const { id } = updateUserParamsSchema.parse(req.params);
    const { name, email, password } = updateUserBodySchema.parse(req.body);

    const response = await userService.update({
      id,
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

const deleteUserSchema = z.object({
  id: z.coerce.number(),
});

export const deleteUser: Route<UserRouteServices> = async (
  req: Request,
  res: Response,
  { userService, errorHandler }
): Promise<Response> => {
  try {
    const { id } = deleteUserSchema.parse(req.params);

    const response = await userService.delete(id);

    if (response instanceof Error) {
      return errorHandler.handleError(response, res);
    }

    return res.json({ user: response });
  } catch (error) {
    return errorHandler.handleError(error as Error, res);
  }
};
