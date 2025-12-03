import type { Metadata } from "next";
import { LoginCard } from "~/components/shared/LoginCard";
export const metadata: Metadata = {
  title: "Login — LinkGate",
};

export default async function LoginPage() {
  return <LoginCard />;
}
