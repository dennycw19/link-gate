"use client";

import NextTopLoader from "nextjs-toploader";

export function TopLoaderProvider() {
  return (
    <NextTopLoader
      height={3}
      color="#ff00c8"
      showSpinner={false}
      zIndex={999999}
    />
  );
}
