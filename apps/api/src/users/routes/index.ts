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

// TODO: should services be injected into the routes or other way around?
interface UserRoute {
  (userService: UserServiceType, errorHandler: ErrorHandler): (
    req: Request,
    res: Response
  ) => void;
}

const findByIdSchema = z.object({
  id: z.coerce.number(),
});

export const findUserById: UserRoute = (userService, errorHandler) => {
  return async (req: Request, res: Response) => {
    try {
      const { id } = findByIdSchema.parse(req.params);

      const response = await userService.findById(Number(id));

      if (response === null) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user: response });
    } catch (error) {
      return errorHandler.handleError(error as Error, res);
    }
  };
};

const findByEmailSchema = z.object({
  email: z.string().email(),
});

export const findUserByEmail: UserRoute = (userService, errorHandler) => {
  return async (req: Request, res: Response) => {
    try {
      const { email } = findByEmailSchema.parse(req.params);

      const response = await userService.findByEmail(email);

      if (response === null) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user: response });
    } catch (error) {
      return errorHandler.handleError(error as Error, res);
    }
  };
};

const updateUserParamsSchema = z.object({
  id: z.coerce.number(),
});

const updateUserBodySchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
});

export const updateUser: UserRoute = (userService, errorHandler) => {
  return async (req: Request, res: Response) => {
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

      res.json({ user: response });
    } catch (error) {
      return errorHandler.handleError(error as Error, res);
    }
  };
};

const deleteUserSchema = z.object({
  id: z.coerce.number(),
});

export const deleteUser: UserRoute = (userService, errorHandler) => {
  return async (req: Request, res: Response) => {
    try {
      const { id } = deleteUserSchema.parse(req.params);

      const response = await userService.delete(id);

      if (response instanceof Error) {
        return errorHandler.handleError(response, res);
      }

      res.json({ user: response });
    } catch (error) {
      return errorHandler.handleError(error as Error, res);
    }
  };
};
