import type { Metadata } from "next";
import { RegisterCard } from "~/components/shared/RegisterCard";

export const metadata: Metadata = {
  title: "Register — LinkGate",
};

export default async function RegisterPage() {
  return <RegisterCard />;
}
