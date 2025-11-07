"use client";
import { Geist, Geist_Mono, Sarabun } from "next/font/google";
import "./globals.css";
import { AuthProvider as BackendAuthProvider } from "./contexts/AuthContext";
import { SessionProvider } from "next-auth/react";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { AntdConfigProvider } from '../lib/antd';

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

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={`${geistSans.variable} ${geistMono.variable} ${sarabun.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/new-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/new-logo.png" />
        <meta name="theme-color" content="#EAB308" />
        <title>ฟิสิกส์พี่เต้ย - เรียนฟิสิกส์อย่างเป็นระบบ</title>
      </head>
      <body>
        <SessionProvider>
          <BackendAuthProvider>
            <AntdRegistry>
              <AntdConfigProvider>
                {children}
              </AntdConfigProvider>
            </AntdRegistry>
          </BackendAuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
