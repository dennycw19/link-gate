import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { LinkCard } from "~/components/shared/LinkCard";
import { Navbar } from "~/components/shared/Navbar";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-4xl py-8">
        <LinkCard />
      </main>
      {/* <Link
      href={session ? "/api/auth/signout" : "/api/auth/signin"}
      className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
    >
      {session ? "Sign out" : "Sign in"}
    </Link> */}
    </>
  );
}
