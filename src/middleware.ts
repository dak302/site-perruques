import { NextResponse, type NextRequest } from "next/server";

const locales = ["he", "fr", "en"];

// Les adresses sans langue (ex. « / ») ouvrent le site en hébreu, la langue principale.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (locales.includes(pathname.split("/")[1])) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = `/he${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!admin|media|api|_next|photos|favicon|robots|sitemap|.*\\..*).*)"],
};
