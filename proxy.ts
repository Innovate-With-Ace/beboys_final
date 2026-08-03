import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgRole } = await auth();
  const path = req.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin");
  const isStaffRoute = path.startsWith("/pos");

  if (path.startsWith("/api")) {
    return NextResponse.next();
  }

  if (!userId && (isAdminRoute || isStaffRoute)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAdminRoute && orgRole !== "org:admin") {
    return NextResponse.redirect(new URL("/no-access", req.url));
  }

  if (isStaffRoute && orgRole !== "org:admin" && orgRole !== "org:staff") {
    return NextResponse.redirect(new URL("/no-access", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/__clerk/:path*",
    "/(api|trpc)(.*)",
  ],
};
