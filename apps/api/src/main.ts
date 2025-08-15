import { PrismaClient } from "@prisma/client";

import { server } from "@/server";
import { DefaultUserService } from "@/users/service/DefaultUserService";
import { DbUserRepository } from "@/users/repository/DbUserRepository";
import { JwtAuthService } from "@/auth/service/JwtAuthService";
import { Base62 } from "@/urls/service/Hash";
import { DefaultUrlService } from "@/urls/service/UrlService";
import { RdbmsUrlRepository } from "@/urls/repository/RdbmsUrlRepository";

const PORT = process.env.PORT || 3001;

const main = async () => {
  const prisma = new PrismaClient();

  const userRepository = new DbUserRepository(prisma);
  const authService = new JwtAuthService();
  const userService = new DefaultUserService(userRepository, authService);

  const hash = new Base62();
  const urlRepository = new RdbmsUrlRepository(prisma);
  const urlService = new DefaultUrlService(urlRepository, hash);

  const capabilities = {
    userService,
    authService,
    urlService,
  };

  const app = await server(capabilities);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

main().catch((error) => {
  console.error("Error starting the server:", error);
  process.exit(1);
});
