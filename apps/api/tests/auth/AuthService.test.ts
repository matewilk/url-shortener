import { JwtAuthService } from "../../src/auth/service/AuthService";
import { AuthServiceSpec } from "./AuthServiceSpec";

AuthServiceSpec.run(new JwtAuthService());
