import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next, Inclusive_Sans } from "next/font/google";
import "./globals.css";

// Body text — Atkinson Hyperlegible Next
const bodyFont = Atkinson_Hyperlegible_Next({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
  adjustFontFallback: false,
});

// Heading text — Inclusive Sans
const headingFont = Inclusive_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Canvas Prototype",
    default: "Canvas Prototype",
  },
  description: "Design baseline for vibe coding prototypes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body className="antialiased overflow-hidden">{children}</body>
    </html>
  );
}
