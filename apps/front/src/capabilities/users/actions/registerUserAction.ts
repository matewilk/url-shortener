"use server";

import { withCapabilitiesAction } from "@/capabilities/withCapabilitiesAction";
import { registerUser } from "./registerUser";

export const registerUserAction = withCapabilitiesAction(registerUser);
