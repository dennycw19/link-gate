"use client";
import { api } from "~/trpc/react";
import { LinkCard } from "./LinkCard";
import { Menubar } from "./Menubar";
import { Navbar } from "./Navbar";
import { useEffect, useRef } from "react";
import { Loader2Icon, Rows } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";

export const HomeLinkList = () => {
  const router = useRouter();
  const loader = useTopLoader();
  const { data: session, status } = useSession();
  const paginatedLinkQuery = api.link.getLinkPaginated.useInfiniteQuery(
    {
      limit: 5,
      userId: session?.user.id ?? "",
    },
    {
      getNextPageParam: ({ nextCursor, links }) => {
        return nextCursor;
      },
      enabled: !!session?.user.id,
    },
  );

  // const handleFetchNextPage = async () => {
  //   await paginatedLinkQuery.fetchNextPage();
  // };

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || !paginatedLinkQuery.hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void paginatedLinkQuery.fetchNextPage();
        }
      },
      { rootMargin: "200px" }, // trigger sebelum benar-benar di viewport
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [loadMoreRef, paginatedLinkQuery]);

  const allLinks =
    paginatedLinkQuery.data?.pages.flatMap((page) => page.links) ?? [];

  const handleLogin = () => {
    loader.start();
    router.push("/login");
  };

  return (
    <>
      <Navbar />

      <main className="container mx-auto max-w-4xl py-8">
        <Menubar />
        <div className="space-y-2 p-2">
          {!paginatedLinkQuery.isLoading && allLinks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 p-4">
                <Rows className="text-accent h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold">No Links Found</h3>
              <p className="text-muted-foreground mt-1 max-w-sm">
                {`You haven't added any links yet. Start by creating your first
                link!`}
              </p>
            </div>
          )}
          {paginatedLinkQuery.data?.pages
            .flatMap((page) => page.links)
            .map((link) => {
              return (
                <LinkCard
                  key={link.id}
                  id={link.id}
                  title={link.title}
                  description={link.description}
                  url={link.link}
                  createdAt={link.createdAt}
                />
              );
            })}
          {/* div kosong untuk trigger infinite scroll */}
          <div ref={loadMoreRef} className="h-1" />
          {paginatedLinkQuery.isFetchingNextPage && (
            <span className="flex items-center justify-center gap-2 text-center">
              <Loader2Icon className="animate-spin" />
              Loading more...
            </span>
          )}
        </div>

        {/* <div className="flex min-h-screen items-center justify-center">
          <div className="bg-card flex h-80 w-100 flex-col justify-between gap-5 rounded-2xl p-8 shadow-lg">
            <div className="space-y-10">
              <h1 className="text-center text-5xl">⚠️</h1>
              <h1 className="text-center text-3xl font-bold">
                You must be logged in to access this website!
              </h1>
            </div>
            <Button onClick={handleLogin}>LOGIN</Button>
          </div>
        </div> */}
      </main>
    </>
  );
};
