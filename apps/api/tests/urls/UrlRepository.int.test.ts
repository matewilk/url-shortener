import { PrismaClient } from "@prisma/client";
import { RdbmsUrlRepository } from "../../src/urls/RdbmsUrlRepository";
import { UrlRepositorySpec } from "./UrlRepositorySpec";

// Maybe use env vars to point to the correct db url
// TODO: Create a new test script that can run `int` tests separate from unit tests
UrlRepositorySpec.run(new RdbmsUrlRepository(new PrismaClient()));
