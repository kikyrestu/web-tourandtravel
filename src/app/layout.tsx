import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SEOHead from "@/components/SEOHead";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nusantara Tour & Travel - Petualangan Tak Terlupakan",
  description: "Temukan pengalaman wisata terbaik di Indonesia. Paket tour Bromo, Ijen, dan destinasi eksotis lainnya dengan harga terjangkau.",
  keywords: ["travel", "tour", "Bromo", "Ijen", "wisata Indonesia", "paket tour", "liburan"],
  authors: [{ name: "Nusantara Tour & Travel" }],
  openGraph: {
    title: "Nusantara Tour & Travel",
    description: "Petualangan Tak Terlupakan di Indonesia",
    url: "https://nusantara-tour.com",
    siteName: "Nusantara Tour & Travel",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nusantara Tour & Travel",
    description: "Petualangan Tak Terlupakan di Indonesia",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <SEOHead />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
