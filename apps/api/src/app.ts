import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";

import { ErrorHandler } from "./error";
import { UrlService } from "./urls/service/UrlService";
import { shorten } from "./urls/routes/shorten";
import { expand } from "./urls/routes/expand";
import { Base62 } from "./urls/service/Hash";
import { RdbmsUrlRepository } from "./urls/repository/RdbmsUrlRepository";
import {
  createUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  updateUser,
} from "./users/routes";
import { DbUserRepository } from "./users/repository/DbUserRepository";
import { UserService } from "./users/service/UserService";

const errorHandler = new ErrorHandler();
const hash = new Base62();
const prisma = new PrismaClient();
const urlRepository = new RdbmsUrlRepository(prisma);
const urlService = new UrlService(urlRepository, hash);

const UserRepositopr = new DbUserRepository(prisma);
const userService = new UserService(UserRepositopr);

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.post("/shorten", shorten(urlService, errorHandler));
app.get("/:shortUrl", expand(urlService, errorHandler));

app.post("/users", createUser(userService, errorHandler));
app.get("/users/id/:id", findUserById(userService, errorHandler));
app.get("/users/email/:email", findUserByEmail(userService, errorHandler));
app.put("/users/id/:id", updateUser(userService, errorHandler));
app.delete("/users/id/:id", deleteUser(userService, errorHandler));

export default app;
