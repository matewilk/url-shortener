import { PrismaClient } from "@prisma/client/extension";
import app from "./app";
import { JwtAuthService } from "./auth/service/JwtAuthService";
import { server } from "./server";
import { DefaultUserService } from "./users/service/DefaultUserService";
import { DbUserRepository } from "./users/repository/DbUserRepository";

const PORT = process.env.PORT || 3001;

const main = async () => {
  const prisma = new PrismaClient();

  const userRepositopr = new DbUserRepository(prisma);
  const authService = new JwtAuthService();
  const userService = new DefaultUserService(userRepositopr, authService);

  const capabilities = {
    userService,
    authService,
  }; // Initialize your capabilities here
  const app = await server(capabilities);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};
