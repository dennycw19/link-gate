import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "~/components/theme-provider";
import { TopLoaderProvider } from "~/components/shared/TopLoaderProvider";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "LinkGate - Private Link Manager",
  description:
    "LinkGate is a safe place to store private links like Google Drive or other cloud storage you share to public but only you can access. Access important links without fear of them being exposed to others, especially when using a public computer.",

  openGraph: {
    type: "website",
    url: "https://link-gate-app.vercel.app/", // ganti sesuai deploymentmu
    title: "LinkGate - Private Link Manager",
    description:
      "LinkGate is a safe place to store private links like Google Drive or other cloud storage you share to public but only you can access. Access important links without fear of them being exposed to others, especially when using a public computer.",
    images: [
      {
        url: "/og-image.png", // taruh image di public folder
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "LinkGate - Private Link Manager",
    description:
      "LinkGate is a safe place to store private links like Google Drive or other cloud storage you share to public but only you can access. Access important links without fear of them being exposed to others, especially when using a public computer.",
    images: ["/og-image.png"],
  },

  creator: "NeoCortexx",
  publisher: "PT Neo Solusindo",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <TopLoaderProvider />
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <TRPCReactProvider>
              {children}
              <Toaster richColors position="top-center" />
            </TRPCReactProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
