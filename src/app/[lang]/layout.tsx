import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer";
import ReduxProvider from "@/providers/ReduxProvider";
import { Locale } from "@/i18n.config";
import { Directions, Languages } from "@/lib/constants";

const roboto = Roboto({
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
      <body className={roboto.className}>
        <ReduxProvider>
          <Header />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
