"use server";

import { withCapabilitiesAction } from "@/capabilities/withCapabilitiesAction";
import { submitUrl } from "./submitUrl";

export const submitUrlAction = withCapabilitiesAction(submitUrl);
