import { withCapabilities } from "@/capabilities/withCapabilities";
import { Register } from "@/capabilities/users/pages/Register";

export default withCapabilities(async () => Register());
