import { Capabilities } from "@/capabilities/Capabilities";
import { RegisterUserForm } from "../components/registerUserForm/RegisterUserForm";

export type PageProps = {
  capabilities: Capabilities;
};

export const Register = async () => {
  return <RegisterUserForm />;
};
