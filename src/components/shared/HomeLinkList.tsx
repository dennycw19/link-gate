"use client";
import { Loader2Icon, Rows } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";
import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import { LinkCard } from "./LinkCard";
import { Menubar } from "./Menubar";
import { Navbar } from "./Navbar";

export const HomeLinkList = () => {
  const router = useRouter();
  const loader = useTopLoader();
  const { data: session } = useSession();
  const [sort, setSort] = useState<"desc" | "asc">("asc");
  const paginatedLinkQuery = api.link.getLinkPaginated.useInfiniteQuery(
    {
      limit: 5,
      userId: session?.user.id ?? "",
      sort,
    },
    {
      getNextPageParam: ({ nextCursor }) => {
        return nextCursor;
      },
      enabled: !!session?.user.id,
    },
  );

  const loadMoreRef = useRef<HTMLDivElement>(null);
  // Infinite scroll observer (fixed version)
  useEffect(() => {
    const el = loadMoreRef.current;

    // Kalau ref belum siap atau tidak ada halaman berikut → jangan pasang observer
    if (!el || !paginatedLinkQuery.hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void paginatedLinkQuery.fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);

    // Cleanup selalu jalan saat:
    // - sort berubah
    // - data berubah
    // - unmount
    return () => {
      observer.unobserve(el);
      observer.disconnect();
    };
  }, [
    paginatedLinkQuery.hasNextPage, // hanya tergantung nextPage
    paginatedLinkQuery.fetchNextPage, // fungsi aman dan stabil
  ]);

  // Infinite scroll observer
  // useEffect(() => {
  //   if (!loadMoreRef.current || !paginatedLinkQuery.hasNextPage) return;

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0]?.isIntersecting) {
  //         void paginatedLinkQuery.fetchNextPage();
  //       }
  //     },
  //     { rootMargin: "200px" }, // trigger sebelum benar-benar di viewport
  //   );

  //   observer.observe(loadMoreRef.current);

  //   return () => observer.disconnect();
  // }, [loadMoreRef, paginatedLinkQuery]);

  const allLinks =
    paginatedLinkQuery.data?.pages.flatMap((page) => page.links) ?? [];

  return (
    <>
      <Navbar />

      <main className="container mx-auto max-w-4xl py-8">
        <Menubar sort={sort} setSort={setSort} />
        <div className="space-y-3 p-2">
          {paginatedLinkQuery.isLoading && (
            <div className="flex flex-col items-center justify-center space-y-2 py-10">
              <Loader2Icon className="text-muted-foreground h-24 w-24 animate-spin" />
              <span className="text-muted-foreground">Loading content...</span>
            </div>
          )}
          {!paginatedLinkQuery.isLoading &&
            paginatedLinkQuery.data?.pages?.[0]?.links?.length === 0 && (
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
                  updatedAt={link.updatedAt}
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
      </main>
    </>
  );
};
