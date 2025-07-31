import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";

import { UrlService } from "./urls/service/UrlService";
import { shorten } from "./urls/routes/shorten";
import { expand } from "./urls/routes/expand";
import { Base62 } from "./urls/service/Hash";
import { RdbmsUrlRepository } from "./urls/repository/RdbmsUrlRepository";
import {
  registerUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  updateUser,
  loginUser,
} from "./users/routes";
import { DbUserRepository } from "./users/repository/DbUserRepository";
import { DefaultUserService } from "./users/service/DefaultUserService";
import { JwtAuthService } from "./auth/service/JwtAuthService";

import { withAuth, withAuthorisation, withServices } from "./Routes";

const hash = new Base62();
const prisma = new PrismaClient();
const urlRepository = new RdbmsUrlRepository(prisma);
const urlService = new UrlService(urlRepository, hash);

const userRepositopr = new DbUserRepository(prisma);
const authService = new JwtAuthService();
const userService = new DefaultUserService(userRepositopr, authService);

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.post("/shorten", withServices(shorten, { urlService }));
app.get("/:shortUrl", withServices(expand, { urlService }));

app.post("/users", withServices(registerUser, { userService }));
app.get(
  "/users/id/:id",
  withAuth(withAuthorisation(findUserById), authService, { userService })
);
app.get(
  "/users/email/:email",
  withAuth(findUserByEmail, authService, { userService })
);
app.put(
  "/users/id/:id",
  withAuth(withAuthorisation(updateUser), authService, { userService })
);
app.delete(
  "/users/id/:id",
  withAuth(withAuthorisation(deleteUser), authService, { userService })
);

app.post("/login", withServices(loginUser, { userService }));

import { Request, Response, NextFunction } from "express";

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message || "Internal server error" });
});

export default app;
