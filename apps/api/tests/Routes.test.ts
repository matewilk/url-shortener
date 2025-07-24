import { withAuthorisation, withServices, withAuth } from "../src/Routes";
import { RoutesSpec } from "./RoutesSpec";

RoutesSpec.runWithServices((route, services) => withServices(route, services));
RoutesSpec.runWithAuth((route, authService, services) =>
  withAuth(route, authService, services)
);
RoutesSpec.runWithAuthorisation((route, _userService) =>
  withAuthorisation(route)
);
