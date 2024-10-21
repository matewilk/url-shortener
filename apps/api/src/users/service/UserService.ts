import { AuthService, Token } from "../../auth/service/AuthService";
import { User, UserRepositopr } from "../repository/UserRepository";

export interface UserServiceType {
  register: (user: User.Draft) => Promise<User | Error>;
  login: (email: string, password: string) => Promise<Token.Draft | Error>;
  findById: (id: number) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
  update: (user: User.Update) => Promise<User | Error>;
  delete: (id: number) => Promise<User | Error>;
}

export class UserService implements UserServiceType {
  constructor(private repo: UserRepositopr, public auth: AuthService) {}

  async register({ name, email, password }: User.Draft): Promise<User | Error> {
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

  async login(email: string, password: string): Promise<Token.Draft | Error> {
    const user = await this.repo.findByEmail(email);

    if (user.kind === "error") {
      return user.error;
    }

    if (user.value === null) {
      return new Error("User not found");
    }

    const verifyResponse = await this.auth.verifyPassword(
      password,
      user.value.password
    );

    if (verifyResponse.kind === "error") {
      return verifyResponse.error;
    }

    if (!verifyResponse.value) {
      return new Error("Invalid password");
    }

    const { name } = user.value;
    const tokenResponse = await this.auth.generateAuthToken({ name });

    if (tokenResponse.kind === "error") {
      return tokenResponse.error;
    }

    return tokenResponse.value;
  }

  async findById(id: number): Promise<User | null> {
    const response = await this.repo.findById(id);

    return response.kind === "success" ? response.value : null;
  }

  // TODO: this should return a Result<User | null, Error> ?
  async findByEmail(email: string): Promise<User | null> {
    const response = await this.repo.findByEmail(email);

    return response.kind === "success" ? response.value : null;
  }

  async update({
    id,
    name,
    email,
    password,
  }: User.Update): Promise<User | Error> {
    const response = await this.repo.update({ id, name, email, password });

    return response.kind === "success" ? response.value : response.error;
  }

  async delete(id: number): Promise<User | Error> {
    const response = await this.repo.delete(id);

    return response.kind === "success" ? response.value : response.error;
  }
}
