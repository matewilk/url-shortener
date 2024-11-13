import { PrismaClient, Prisma } from "@prisma/client";

import { Result, ok, err } from "@/Result";
import { User, UserRepository } from "./UserRepository";
import { DbError, PrismaError, toError } from "@/error";

export class DbUserRepository implements UserRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(user: User.Draft): Promise<Result<User.Return, Error>> {
    try {
      const record = await this.db.user.create({
        data: {
          createdAt: new Date(),
          ...user,
        },
      });

      // TODO: why typescript is not shouting about too many fields in the returned record?
      return ok(record);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        PrismaError.isUniqueConstraintError(error)
      ) {
        return err(new Error("Email already in use"));
      }
      return err(toError(error));
    }
  }

  async findById(id: number): Promise<Result<User | null, Error>> {
    try {
      const record = await this.db.user.findUnique({
        where: {
          id,
        },
      });

      return ok(record);
    } catch (error) {
      return err(toError(error));
    }
  }

  async findByEmail(email: string): Promise<Result<User | null, Error>> {
    try {
      const record = await this.db.user.findUnique({
        where: {
          email,
        },
      });

      return ok(record);
    } catch (error) {
      return err(toError(error));
    }
  }

  async update(user: User.Update): Promise<Result<User, Error>> {
    try {
      const { id, ...data } = user;
      const record = await this.db.user.update({
        where: {
          id,
        },
        data,
      });

      return ok(record);
    } catch (error) {
      return err(toError(error));
    }
  }

  async delete(id: number): Promise<Result<User, Error>> {
    try {
      const record = await this.db.user.delete({
        where: {
          id,
        },
      });

      return ok(record);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        PrismaError.isRecordNotFoundError(error)
      ) {
        return err(new DbError(`User with ID ${id} not found.`, 404));
      }
      return err(toError(error));
    }
  }
}
