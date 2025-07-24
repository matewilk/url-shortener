import { withAuthorisation, withServices } from "../src/Routes";
import { RoutesSpec } from "./RoutesSpec";

RoutesSpec.runWithServices((route, services) => withServices(route, services));
RoutesSpec.runWithAuthorisation((route, _userService) =>
  withAuthorisation(route)
);
