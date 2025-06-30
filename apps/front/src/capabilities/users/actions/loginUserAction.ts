"use server";

import { withCapabilitiesAction } from "@/capabilities/withCapabilitiesAction";
import { loginUser } from "./loginUser";

export const loginUserAction = withCapabilitiesAction(loginUser);
