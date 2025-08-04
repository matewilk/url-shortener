import { Request, Response, Router } from "express";

import { baseUserSchema } from "@/users/User";
import { match, matchErrorTag } from "@/prelude/Result";

import { UserService } from "@/users/service/UserService";
import { AuthMiddleware } from "@/auth/middleware/AuthMiddleware";
import { BaseController } from "@/BaseController";

const registerUserSchema = baseUserSchema.omit({ id: true });
const loginUserSchema = baseUserSchema.pick({ email: true, password: true });
const findByIdSchema = baseUserSchema.pick({ id: true });
const updateUserParamsSchema = baseUserSchema.pick({ id: true });
const updateUserBodySchema = baseUserSchema.omit({ id: true }).partial();
const deleteUserSchema = baseUserSchema.pick({ id: true });

export class UserController extends BaseController {
  constructor(
    private userService: UserService,
    private authMiddleware: AuthMiddleware
  ) {
    super();
  }

  getRouter(): Router {
    const router = Router();

    const registerUser = async (req: Request, res: Response) => {
      const { name, email, password } = registerUserSchema.parse(req.body);

      const result = await this.userService.register({
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

    const loginUser = async (req: Request, res: Response) => {
      const { email, password } = loginUserSchema.parse(req.body);

      const result = await this.userService.login(email, password);

      return match(result, {
        onOk: (token) => res.json(token),
        onErr: () => res.status(401).json({ error: "Unauthorized" }),
      });
    };

    const findUserById = async (req: Request, res: Response) => {
      const { id } = findByIdSchema.parse(req.params);

      const result = await this.userService.findById(Number(id));

      return match(result, {
        onOk: (value) => res.json({ user: value }),
        onErr: (error) =>
          matchErrorTag(error, {
            NotFound: () => res.status(404).json({ error: "User not found" }),
          }),
      });
    };

    const updateUser = async (req: Request, res: Response) => {
      const { id } = updateUserParamsSchema.parse(req.params);
      const { name, email, password } = updateUserBodySchema.parse(req.body);

      const result = await this.userService.update(id, {
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

    const deleteUser = async (req: Request, res: Response) => {
      const { id } = deleteUserSchema.parse(req.params);

      await this.userService.delete(id);

      return res.send(204);
    };

    router.post("/users", this.asyncHandler(registerUser));
    router.post("/login", this.asyncHandler(loginUser));
    router.get(
      "/users/id/:id",
      this.authMiddleware.authenticate,
      this.authMiddleware.authorise,
      this.asyncHandler(findUserById)
    );
    router.put(
      "/users/id/:id",
      this.authMiddleware.authenticate,
      this.authMiddleware.authorise,
      this.asyncHandler(updateUser)
    );
    router.delete(
      "/users/id/:id",
      this.authMiddleware.authenticate,
      this.authMiddleware.authorise,
      this.asyncHandler(deleteUser)
    );

    return router;
  }
}
