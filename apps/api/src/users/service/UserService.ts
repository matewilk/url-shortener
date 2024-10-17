import { User, UserRepositopr } from "../repository/UserRepository";

export interface UserServiceType {
  createUser: (email: string, password: string) => Promise<User | Error>;
  findUserById: (id: number) => Promise<User | null>;
  findUserByEmail: (email: string) => Promise<User | null>;
  updateUser: (
    id: number,
    email?: string,
    password?: string
  ) => Promise<User | Error>;
  deleteUser: (id: number) => Promise<User | Error>;
}

export class UserService implements UserServiceType {
  constructor(private repo: UserRepositopr) {}

  async createUser(email: string, password: string): Promise<User | Error> {
    const response = await this.repo.create({ email, password });

    return response.kind === "success" ? response.value : response.error;
  }

  async findUserById(id: number): Promise<User | null> {
    const response = await this.repo.findById(id);

    return response.kind === "success" ? response.value : null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const response = await this.repo.findByEmail(email);

    return response.kind === "success" ? response.value : null;
  }

  async updateUser(
    id: number,
    email?: string,
    password?: string
  ): Promise<User | Error> {
    const response = await this.repo.update({ id, email, password });

    return response.kind === "success" ? response.value : response.error;
  }

  async deleteUser(id: number): Promise<User | Error> {
    const response = await this.repo.delete(id);

    return response.kind === "success" ? response.value : response.error;
  }
}
