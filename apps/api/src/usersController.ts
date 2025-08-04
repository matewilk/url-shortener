import { Router } from "express";

import { AuthService } from "./auth/service/AuthService";
import { UserService } from "./users/service/UserService";
import { baseUserSchema } from "./users/User";
import { match, matchErrorTag } from "./prelude/Result";
import { AuthMiddleware } from "./authMiddleware";

const registerUserSchema = baseUserSchema.omit({ id: true });

export class UserController {
  constructor(
    private userService: UserService,
    private authMiddleware: AuthMiddleware
  ) {}

  getRouter() {
    const router = Router();

    router.post(
      "/users",
      this.authMiddleware.authenticate,
      async (req, res) => {
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
      }
    );

    return router;
  }
}
