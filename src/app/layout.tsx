import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "AgroKwalify",
  description:
    "🌍 AgroKwalify — The end-to-end, Hedera-powered operating system for Africa’s agricultural commerce. Enabling product verification, provenance tracking, and instant payments for farmers and buyers through Hedera’s Consensus, Token, and Smart Contract Services.",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },     // ✅ PNG version
      { url: "/favicon.ico", type: "image/x-icon" } // ✅ optional backup
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
