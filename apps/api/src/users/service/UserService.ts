import { AuthService } from "../../auth/service/AuthService";
import { User, UserRepositopr } from "../repository/UserRepository";

export interface UserServiceType {
  registerUser: (user: User.Draft) => Promise<User | Error>;
  findUserById: (id: number) => Promise<User | null>;
  findUserByEmail: (email: string) => Promise<User | null>;
  updateUser: (user: User.Update) => Promise<User | Error>;
  deleteUser: (id: number) => Promise<User | Error>;
}

export class UserService implements UserServiceType {
  constructor(private repo: UserRepositopr, public auth: AuthService) {}

  async registerUser({
    name,
    email,
    password,
  }: User.Draft): Promise<User | Error> {
    const userExists = await this.repo.findByEmail(email);

    // TODO: user repo interface does not clearly define the return type
    if (userExists.kind === "success" && userExists.value !== null) {
      return new Error("User already exists");
    }

    const hashResponse = await this.auth.hashPassword(password);
    if (hashResponse.kind === "error") {
      return hashResponse.error;
    }

    const response = await this.repo.create({
      name,
      email,
      password: hashResponse.value,
    });

    return response.kind === "success" ? response.value : response.error;
  }

  async findUserById(id: number): Promise<User | null> {
    const response = await this.repo.findById(id);

    return response.kind === "success" ? response.value : null;
  }

  // TODO: this should return a Result<User | null, Error> ?
  async findUserByEmail(email: string): Promise<User | null> {
    const response = await this.repo.findByEmail(email);

    return response.kind === "success" ? response.value : null;
  }

  async updateUser({
    id,
    name,
    email,
    password,
  }: User.Update): Promise<User | Error> {
    const response = await this.repo.update({ id, name, email, password });

    return response.kind === "success" ? response.value : response.error;
  }

  async deleteUser(id: number): Promise<User | Error> {
    const response = await this.repo.delete(id);

    return response.kind === "success" ? response.value : response.error;
  }
}
