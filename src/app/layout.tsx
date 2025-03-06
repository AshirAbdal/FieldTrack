"use client";
import { Provider } from "@/src/provider/page";
import { SessionProvider } from "next-auth/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white">
      <Provider>
        <body
          className={`h-full ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SessionProvider>{children}</SessionProvider>
        </body>
      </Provider>
    </html>
  );
}
