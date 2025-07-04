import type { Metadata } from "next";
import { Roboto} from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: true
});



export const metadata: Metadata = {
  title: "Food Ordering App",
  description: "A simple food ordering application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <div className="min-h-screen relative">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
