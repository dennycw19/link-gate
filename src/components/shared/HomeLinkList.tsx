"use client";
import { api } from "~/trpc/react";
import { LinkCard } from "./LinkCard";
import { Menubar } from "./Menubar";
import { Navbar } from "./Navbar";
import { useEffect, useRef } from "react";
import { Loader2Icon } from "lucide-react";

export const HomeLinkList = () => {
  const paginatedLinkQuery = api.link.getLinkPaginated.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getNextPageParam: ({ nextCursor, links }) => {
        return nextCursor;
      },
    },
  );

  const handleFetchNextPage = async () => {
    await paginatedLinkQuery.fetchNextPage();
  };

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || !paginatedLinkQuery.hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          paginatedLinkQuery.fetchNextPage();
        }
      },
      { rootMargin: "200px" }, // trigger sebelum benar-benar di viewport
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [loadMoreRef, paginatedLinkQuery]);

  const allLinks =
    paginatedLinkQuery.data?.pages.flatMap((page) => page.links) ?? [];

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-4xl py-8">
        <Menubar />
        <div className="space-y-2 p-2">
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
      </main>
    </>
  );
};
