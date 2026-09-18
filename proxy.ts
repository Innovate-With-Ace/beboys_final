import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgRole } = await auth();
  const path = req.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin");
  const isStaffRoute = path.startsWith("/pos");

  console.log(orgRole);

  if (path.startsWith("/api")) {
    // Baseline check only: every route still calls validateUser() itself
    // for role-level checks. This just guarantees no /api route can ever
    // be fully open if one forgets to call validateUser().
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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
