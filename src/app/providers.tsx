"use client";

import { ProgressProvider } from "@bprogress/next/app";
import { useEffect, useState } from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <ProgressProvider
      height="4px"
      color="#4a7c52"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};

export default Providers;
