import { NextResponse } from "next/server";

export function middleware(request) {
  const accessToken = request.cookies.get("AccessToken")?.value;
  const pathname = request.nextUrl.pathname;

  // Protected routes that require authentication
  const isProtectedPath = 
    pathname.startsWith("/researchdashboard")

  
  // Authentication routes that should redirect if already logged in
  const authPaths = ["/signin", "/signup"];
  const isAuthPath = authPaths.includes(pathname);

  // If trying to access protected path without token, redirect to signin
  if (isProtectedPath && !accessToken) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // If trying to access auth path with token, redirect to dashboard
  if (isAuthPath && accessToken) {
    return NextResponse.redirect(
      new URL("/researchdashboard/overview", request.url)
    );
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which routes this middleware applies to
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};