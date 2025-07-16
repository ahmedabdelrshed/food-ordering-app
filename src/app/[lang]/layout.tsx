import type { Metadata } from "next";
import { Cairo, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer";
import ReduxProvider from "@/providers/ReduxProvider";
import { Locale } from "@/i18n.config";
import { Directions, Languages } from "@/lib/constants";
import { Toaster } from "react-hot-toast";
import NextAuthSessionProvider from "@/providers/NextAuthSessionProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: true,
});
const cairo = Cairo({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: true,
});

export const metadata: Metadata = {
  title: "Food Ordering App",
  description: "A simple food ordering application built with Next.js",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  const lang = (await params).lang;

  return (
    <html
      lang={lang}
      dir={lang === Languages.ARABIC ? Directions.RTL : Directions.LTR}
    >
      <body
        className={
          lang === Languages.ARABIC ? cairo.className : roboto.className
        }
      >
        <ReduxProvider>
          <NextAuthSessionProvider>
            <Header />
            {children}
            <Footer />
            <Toaster />
          </NextAuthSessionProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
