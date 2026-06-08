import type { Metadata } from "next";
import { Geist, Geist_Mono, Pixelify_Sans, Press_Start_2P } from "next/font/google";
import "./globals.css";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixel",
});

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  variable: "--font-press",
  weight: "400",
});

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="ko" className={`${pixelify.variable} ${pressStart2P.variable} `}>
      <body className="font-pixel antialiased bg-zinc-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}

