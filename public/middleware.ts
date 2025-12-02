import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Ambil token dari cookie (ubah 'token' sesuai nama cookie loginmu)
  const token = request.cookies.get("token")?.value;

  // Daftar halaman yang diproteksi
  const protectedPaths = ["/", "/register"];

  // Jika user mengakses halaman proteksi dan belum login → redirect ke /login
  if (protectedPaths.includes(url.pathname) && !token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Jika user sudah login → biarkan akses normal
  return NextResponse.next();
}

// Middleware aktif di semua path yang diproteksi
export const config = {
  matcher: ["/", "/register"],
};
