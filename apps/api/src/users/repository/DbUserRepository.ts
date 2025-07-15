import { PrismaClient, Prisma } from "@prisma/client";

import { Result, ok, err } from "@/prelude/Result";
import { User } from "@/users/User";
import { UserRepository } from "./UserRepository";
import { PrismaError } from "@/error";

export class DbUserRepository implements UserRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(
    user: User.Draft
  ): Promise<Result<User.Return, User.AlreadyExists>> {
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
        return err(new User.AlreadyExists());
      }
      throw error;
    }
  }

  async findById(id: number): Promise<Result<User, User.NotFound>> {
    const record = await this.db.user.findUnique({
      where: {
        id,
      },
    });

    if (!record) return err(new User.NotFound());

    return ok(record);
  }

  async findByEmail(email: string): Promise<Result<User, User.NotFound>> {
    const record = await this.db.user.findUnique({
      where: {
        email,
      },
    });

    if (!record) return err(new User.NotFound());

    return ok(record);
  }

  async update(
    id: number,
    patch: User.Patch
  ): Promise<Result<User, User.UpdateError>> {
    try {
      const record = await this.db.user.update({
        where: {
          id,
        },
        data: patch,
      });

      return ok(record);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (PrismaError.isRecordNotFoundError(error)) {
          return err(new User.NotFound());
        }

        if (PrismaError.isUniqueConstraintError(error)) {
          return err(new User.AlreadyExists());
        }
      }
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    await this.db.user.delete({
      where: {
        id,
      },
    });
  }
}
