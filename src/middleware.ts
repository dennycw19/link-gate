// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import path from "path";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // 💡 Cek cookie sesi utama Auth.js (NextAuth v5)
  const token =
    req.cookies.get("authjs.session-token")?.value ??
    req.cookies.get("__Secure-authjs.session-token")?.value;

  // Halaman yang diproteksi
  const protectedPaths = ["/", "/register"];

  // Jika user mengakses halaman proteksi dan belum login → redirect ke /login
  if (protectedPaths.includes(url.pathname) && !token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (token && url.pathname === "/login") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  // User sudah login → biarkan akses normal
  return NextResponse.next();
}

// Hanya jalankan middleware untuk halaman proteksi
export const config = {
  matcher: ["/", "/register", "/login"], // jangan include /login
};
