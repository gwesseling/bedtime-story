import type { Metadata, Viewport } from "next";
import { Fraunces, Quicksand, Itim } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const quicksand = Quicksand({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const itim = Itim({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Every Night, More",
  description:
    "An animated bedtime scroll story inspired by Guess How Much I Love You, with room for a voice of your own.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#2b2440",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${quicksand.variable} ${itim.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
