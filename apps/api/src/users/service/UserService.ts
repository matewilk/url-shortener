import { AuthServiceType } from "../../auth/service/AuthService";
import { User, UserRepositopr } from "../repository/UserRepository";

export interface UserServiceType {
  registerUser: (email: string, password: string) => Promise<User | Error>;
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
  constructor(private repo: UserRepositopr, public auth: AuthServiceType) {}

  async registerUser(email: string, password: string): Promise<User | Error> {
    const userExists = await this.repo.findByEmail(email);

    // TODO: user repo interface does not clearly define the return type
    if (userExists.kind === "success" && userExists.value === null) {
      return new Error("User already exists");
    }

    // TODO: same as above redefine the return type
    const hashResponse = await this.auth.hashPassword(password);
    if (hashResponse instanceof Error) {
      return hashResponse;
    }

    const response = await this.repo.create({
      email,
      password: hashResponse.hashedPassword,
    });

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
