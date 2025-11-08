import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Sarabun } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";

export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sarabun",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "ฟิสิกส์พี่เต้ย - เรียนฟิสิกส์อย่างเป็นระบบ",
  icons: {
    icon: "/new-logo.png",
    apple: "/new-logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#EAB308",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} ${sarabun.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
