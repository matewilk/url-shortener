import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { withCapabilitiesLayout } from "@/capabilities/withCapabilitiesLayout";
import { Capabilities } from "@/capabilities/Capabilities";

import { Header } from "../layouts/Header";
import { Footer } from "../layouts/Footer";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Shortify",
  description: "Url shortener",
};

function RootLayout({
  children,
  capabilities,
}: Readonly<{
  children: React.ReactNode;
  capabilities: Capabilities;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="font-[family-name:var(--font-geist-sans)] bg-blue-200">
          <div className="flex flex-col min-h-screen pb-10 items-center justify-between w-full mx-auto">
            <Header capabilities={capabilities} />
            <main className="flex-grow flex items-center justify-center p-6">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}

export default withCapabilitiesLayout(RootLayout);
