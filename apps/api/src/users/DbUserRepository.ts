import { PrismaClient } from "@prisma/client/extension";
import { Result, User, UserRepositopr } from "./UserRepository";

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
      const record = await this.db.user.update({
        where: {
          id: user.id,
        },
        data: user,
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
      return Promise.reject({ kind: "error", error });
    }
  }
}
