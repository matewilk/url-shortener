import { beforeEach, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

import {
  createUser,
  findUserById,
  findUserByEmail,
  updateUser,
  deleteUser,
} from "../../src/users/routes";
import { UserService } from "../../src/users/service/UserService";
import { DbUserRepository } from "../../src/users/repository/DbUserRepository";
import { ErrorHandler } from "../../src/error";
import { UserRoutesSpec } from "./UserRoutesSpec";

const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

UserRoutesSpec.run(
  { createUser, findUserById, findUserByEmail, updateUser, deleteUser },
  new UserService(new DbUserRepository(prisma)),
  new ErrorHandler()
);
