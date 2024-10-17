import { Prisma, PrismaClient } from "@prisma/client";
import { Result, User, UserRepositopr } from "./UserRepository";
import { DbError } from "../../error";

export class DbUserRepository implements UserRepositopr {
  constructor(private readonly db: PrismaClient) {}

  async create(user: User.Draft): Promise<Result<User, Error>> {
    try {
      const record = await this.db.user.create({
        data: {
          createdAt: new Date(),
          ...user,
        },
      });

      return Promise.resolve({ kind: "success", value: record });
    } catch (error) {
      return Promise.reject({ kind: "error", error });
    }
  }

  async findById(id: number): Promise<Result<User | null, Error>> {
    try {
      const record = await this.db.user.findUnique({
        where: {
          id,
        },
      });

      return Promise.resolve({ kind: "success", value: record });
    } catch (error) {
      return Promise.reject({ kind: "error", error });
    }
  }

  async findByEmail(email: string): Promise<Result<User | null, Error>> {
    try {
      const record = await this.db.user.findUnique({
        where: {
          email,
        },
      });

      return Promise.resolve({ kind: "success", value: record });
    } catch (error) {
      return Promise.reject({ kind: "error", error });
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

      return Promise.resolve({ kind: "success", value: record });
    } catch (error) {
      return Promise.reject({ kind: "error", error });
    }
  }

  async delete(id: number): Promise<Result<User, Error>> {
    try {
      const record = await this.db.user.delete({
        where: {
          id,
        },
      });

      return Promise.resolve({ kind: "success", value: record });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          // TODO: handle this more gracefully
          return Promise.resolve({
            kind: "error",
            error: new DbError(`User with ID ${id} not found.`, 404),
          });
        }
      }
      return Promise.reject({ kind: "error", error });
    }
  }
}
