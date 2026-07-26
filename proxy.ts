import { clerkMiddleware } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';



export default clerkMiddleware(async (auth, req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isStaffRoute = req.nextUrl.pathname.startsWith('/pos');

  const { userId, orgId, orgRole, sessionClaims } = await auth()

  if(!userId && (isAdminRoute || isStaffRoute)){
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAdminRoute && orgRole !== 'org:admin') {
    return NextResponse.redirect(new URL('/no-access', req.url));
  }

 if (isStaffRoute && orgRole !== 'org:admin' && orgRole !== 'org:staff') {
    return NextResponse.redirect(new URL('/no-access', req.url));
  }


});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/__clerk/:path*',
    '/(api|trpc)(.*)',
  ],
};