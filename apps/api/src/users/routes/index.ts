import { Request, Response } from "express";
import { z } from "zod";

import { UserServiceType } from "../service/UserService";
import { ErrorHandler } from "../../error";

interface UserRoute {
  (userService: UserServiceType, errorHandler: ErrorHandler): (
    req: Request,
    res: Response
  ) => void;
}

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const createUser: UserRoute = (userService, errorHandler) => {
  return async (req: Request, res: Response) => {
    try {
      const { email, password } = createUserSchema.parse(req.body);

      const response = await userService.createUser(email, password);

      if (response instanceof Error) {
        errorHandler.handleError(response, res);
      }

      res.json({ user: response });
    } catch (error) {
      errorHandler.handleError(error as Error, res);
    }
  };
};

const findByIdSchema = z.object({
  id: z.number(),
});

export const findUserById: UserRoute = (userService, errorHandler) => {
  return async (req: Request, res: Response) => {
    try {
      const { id } = findByIdSchema.parse(req.params);

      const response = await userService.findUserById(Number(id));

      if (response === null) {
        errorHandler.handleError(new Error("User not found"), res);
      }

      res.json({ user: response });
    } catch (error) {
      errorHandler.handleError(error as Error, res);
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

      const response = await userService.findUserByEmail(email);

      if (response === null) {
        errorHandler.handleError(new Error("User not found"), res);
      }

      res.json({ user: response });
    } catch (error) {
      errorHandler.handleError(error as Error, res);
    }
  };
};

const updateUserSchema = z.object({
  id: z.number(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
});

export const updateUser: UserRoute = (userService, errorHandler) => {
  return async (req: Request, res: Response) => {
    try {
      const { id, email, password } = updateUserSchema.parse(req.body);

      const response = await userService.updateUser(id, email, password);

      if (response instanceof Error) {
        errorHandler.handleError(response, res);
      }

      res.json({ user: response });
    } catch (error) {
      errorHandler.handleError(error as Error, res);
    }
  };
};

const deleteUserSchema = z.object({
  id: z.number(),
});

export const deleteUser: UserRoute = (userService, errorHandler) => {
  return async (req: Request, res: Response) => {
    try {
      const { id } = deleteUserSchema.parse(req.params);

      const response = await userService.deleteUser(id);

      if (response instanceof Error) {
        errorHandler.handleError(response, res);
      }

      res.json({ user: response });
    } catch (error) {
      errorHandler.handleError(error as Error, res);
    }
  };
};
