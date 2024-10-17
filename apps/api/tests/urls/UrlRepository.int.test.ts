import { beforeEach, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

import { RdbmsUrlRepository } from "../../src/urls/repository/RdbmsUrlRepository";
import { UrlRepositorySpec } from "./UrlRepositorySpec";

const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "Url" RESTART IDENTITY CASCADE`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

UrlRepositorySpec.run(new RdbmsUrlRepository(prisma));
