import type { Metadata } from "next";
import "./globals.css";
import { basisGrotesque, graphik, minionPro, helvetica } from "./fonts";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Providers from "./providers";
import ConditionalCTA from "@/components/conditional-cta";
import { GoogleAnalytics } from "@next/third-parties/google";
import { envVar } from "@/config/env-var";

export const metadata: Metadata = {
  title: "Widarto Impact",
  description:
    "Widarto Impact is a design agency that helps businesses create meaningful and impactful experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href={envVar.API_URL} />
        <link rel="dns-prefetch" href={envVar.API_URL} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${basisGrotesque.variable} ${graphik.variable} ${minionPro.variable} ${helvetica.variable} antialiased`}
      >
        <GoogleAnalytics gaId="G-V11PXGNGFS" />
        <Navbar />
        <Providers>
          <main className="main-padding">{children}</main>
        </Providers>
        <ConditionalCTA />
        <Footer />
      </body>
    </html>
  );
}
