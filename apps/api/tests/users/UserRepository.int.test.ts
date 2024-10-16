import { beforeEach, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

import { DbUserRepository } from "../../src/users/DbUserRepository";
import { UserRepositorySpec } from "./UserRepositorySpec";

const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

UserRepositorySpec.run(new DbUserRepository(prisma));
