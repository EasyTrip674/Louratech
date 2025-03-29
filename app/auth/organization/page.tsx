import { Metadata } from "next";
import CreationOrganisationFormulaire from "./CreateOrganizationForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up page",
  // other metadata
};

export default function SignUp() {
  return <CreationOrganisationFormulaire />;
}
