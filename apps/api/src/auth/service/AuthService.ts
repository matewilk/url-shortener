import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface AuthServiceType {
  hashPassword: (
    password: string
  ) => Promise<{ hashedPassword: string } | Error>;
  authenticate: (
    username: string,
    password: string,
    dbPassword: string
  ) => Promise<{ token: string } | Error>;
}

export class AuthService implements AuthServiceType {
  async hashPassword(
    password: string
  ): Promise<{ hashedPassword: string } | Error> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return { hashedPassword };
    } catch (error) {
      return new Error("Error hashing password");
    }
  }

  async authenticate(
    username: string,
    password: string,
    dbPassword: string
  ): Promise<{ token: string } | Error> {
    try {
      const match = await bcrypt.compare(password, dbPassword);
      if (!match) {
        return new Error("Invalid password");
      }

      const token = jwt.sign({ username }, process.env.JWT_SECRET as string, {
        expiresIn: "1h",
      });

      return { token };
    } catch (error) {
      return new Error("Error creating token");
    }
  }
}
