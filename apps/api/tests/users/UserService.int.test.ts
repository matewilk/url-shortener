import { beforeEach, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

import { UserServiceSpec } from "./UserServiceSpec";
import { DefaultUserService } from "../../src/users/service/DefaultUserService";
import { DbUserRepository } from "../../src/users/repository/DbUserRepository";
import { JwtAuthService } from "../../src/auth/service/JwtAuthService";

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
UserServiceSpec.run(new DefaultUserService(userRepositopr, authService));
