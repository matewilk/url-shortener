import { beforeEach, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

import { UserServiceSpec } from "./UserServiceSpec";
import { UserService } from "../../src/users/service/UserService";
import { DbUserRepository } from "../../src/users/repository/DbUserRepository";
import { JwtAuthService } from "../../src/auth/service/AuthService";

const prisma = new PrismaClient();
console.log("DB_URL", process.env.DATABASE_URL);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

const userRepositopr = new DbUserRepository(prisma);
const authService = new JwtAuthService();
UserServiceSpec.run(new UserService(userRepositopr, authService));
