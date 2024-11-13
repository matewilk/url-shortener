import { JwtAuthService } from "../../src/auth/service/JwtAuthService";
import { AuthServiceSpec } from "./AuthServiceSpec";

AuthServiceSpec.run(new JwtAuthService());
