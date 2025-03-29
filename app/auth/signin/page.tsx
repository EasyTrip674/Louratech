import { Metadata } from "next";
import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in page",
  // other metadata
};

export default function SignIn() {
  return <SignInForm />;
}
