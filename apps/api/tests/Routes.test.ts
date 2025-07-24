import { withAuthorisation } from "../src/Routes";
import { RoutesSpec } from "./RoutesSpec";

RoutesSpec.run((_userService, route) => withAuthorisation(route));
