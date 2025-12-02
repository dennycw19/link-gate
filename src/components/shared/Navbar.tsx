"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTopLoader } from "nextjs-toploader";

export const Navbar = () => {
  const router = useRouter();
  const session = useSession();
  const loader = useTopLoader();

  const handleRegister = () => {
    loader.start();
    router.push("/register");
  };
  const handleLogin = async () => {
    loader.start();
    await signIn();
  };
  const handleLogout = async () => {
    loader.start();
    await signOut();
  };
  console.log(session);

  return (
    <nav className="border-b">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="text-xl font-bold">
          <Link href={"/"}>Link Gate</Link>
        </div>
        <div className="flex gap-4">
          <Button type="button" onClick={handleRegister}>
            Register
          </Button>
          {session.data?.user ? (
            <Button type="button" variant={"secondary"} onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button type="button" onClick={handleLogin}>
              Login
            </Button>
          )}
        </div>
      </header>
    </nav>
  );
};
