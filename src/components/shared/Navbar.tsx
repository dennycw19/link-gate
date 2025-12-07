"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";
import { Button } from "../ui/button";

export const Navbar = () => {
  const router = useRouter();
  // const session = useSession();
  const loader = useTopLoader();

  const handleRegister = () => {
    loader.start();
    router.push("/register");
  };

  const handleLogout = async () => {
    loader.start();
    await signOut();
  };

  return (
    <nav className="border-b">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="text-xl font-bold">
          {/* <Link href={"/"}>Link Gate</Link> */}
          <Link href={"/"}>
            <Image
              src="/link-gate-logo.png"
              alt="Link Gate Logo"
              width={240} // otomatis menjaga rasio dari 1035x541
              height={120} // sesuaikan dengan tinggi navbar
              className="h-10 w-auto" // h-10 = 40px (standar navbar)
              priority
            />
          </Link>
        </div>
        <div className="flex gap-4">
          <Button type="button" onClick={handleRegister}>
            Register
          </Button>
          <Button type="button" variant={"secondary"} onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
    </nav>
  );
};
