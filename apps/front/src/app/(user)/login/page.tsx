import { withCapabilities } from "@/capabilities/withCapabilities";
import { Login } from "@/capabilities/users/pages/Login";

export default withCapabilities(async () => <Login />);
