import { NextRequest, NextResponse } from "next/server";
import Negotiator from "negotiator";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import { i18n, LanguageType, Locale } from "./i18n.config";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { Pages, Routes } from "./lib/constants";
import { UserRole } from "@prisma/client";

function getLocale(request: NextRequest): string | undefined {
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    const locales: LanguageType[] = i18n.locales;
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
    let locale = "";

    try {
        locale = matchLocale(languages, locales, i18n.defaultLocale);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (error: any) {
        locale = i18n.defaultLocale;
    }
    return locale;
}

export default withAuth(async function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-url", request.url);

    const pathname = request.nextUrl.pathname;

    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) => !pathname.startsWith(`/${locale}`)
    );
    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);
        return NextResponse.redirect(
            new URL(`/${locale}${pathname}`, request.url)
        );
    }
    const currentLocale = request.url.split("/")[3] as Locale;
    const isAuth = await getToken({ req: request });
    const isAuthPage = pathname.startsWith(`/${currentLocale}/${Routes.AUTH}`);
    const protectedRoutes = [Routes.PROFILE, Routes.ADMIN];
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(`/${currentLocale}/${route}`)
    );
    // if user not logged in and try to access protected route
    if (!isAuth && isProtectedRoute) {
        console.log('auth')
        return NextResponse.redirect(
            new URL(`/${currentLocale}/${Routes.AUTH}/${Pages.LOGIN}`, request.url)
        );
    }
    // if user logged in and try to access auth page
    if (isAuth && isAuthPage) {
        const role = isAuth.role;
        if (role === UserRole.ADMIN) {
            return NextResponse.redirect(
                new URL(`/${currentLocale}/${Routes.ADMIN}`, request.url)
            );
        }
        return NextResponse.redirect(
            new URL(`/${currentLocale}/${Routes.PROFILE}`, request.url)
        );
    }

    // if user logged in and he isn't admin and try to access admin route
    if (isAuth && pathname.startsWith(`/${currentLocale}/${Routes.ADMIN}`)) {
        const role = isAuth.role;
        if (role !== UserRole.ADMIN) {
            return NextResponse.redirect(
                new URL(`/${currentLocale}/${Routes.PROFILE}`, request.url)
            );
        }
    }
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

}, {
    callbacks: {
        authorized() {
            return true;
        },
    }
})



export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images).*)",
    ],
};