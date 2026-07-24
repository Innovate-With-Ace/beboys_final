import { clerkMiddleware } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';



export default clerkMiddleware(async (auth, req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isStaffRoute = req.nextUrl.pathname.startsWith('/pos');

  const { userId, orgId, orgRole, sessionClaims } = await auth()
  console.log('userId:', userId)
  console.log('orgId:', orgId)
  console.log('orgRole:', orgRole)


  console.log("Org Role :", orgRole);

  if(!userId && (isAdminRoute || isStaffRoute)){
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAdminRoute && orgRole !== 'org:admin') {
    return NextResponse.redirect(new URL('/no-access', req.url));
  }

 if (isStaffRoute && orgRole !== 'org:admin' && orgRole !== 'org:staff') {
    return NextResponse.redirect(new URL('/no-access', req.url));
  }

  console.log("No Org role");


});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/__clerk/:path*',
    '/(api|trpc)(.*)',
  ],
};