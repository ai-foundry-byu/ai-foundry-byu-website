import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Transitional / editorial serif for headlines — the Lyon/Tiempos free analog.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  // byu-aifoundry.com currently serves a second live copy of this site from
  // another Vercel account. Until that redirects, this tells search engines
  // which host is authoritative and makes every OG/Twitter image URL absolute
  // against the official domain rather than whichever host served the page.
  metadataBase: new URL("https://aifoundry.byu.edu"),
  alternates: { canonical: "/" },
  title: "AI Foundry | Where MBAs forge AI strategy",
  description:
    "BYU Marriott's AI Foundry. MBAs and undergrads who forge AI strategy — and ship production systems for real clients. Not case studies. Real stakes.",
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/favicon-180.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "AI Foundry | Where MBAs forge AI strategy",
    description:
      "BYU Marriott's AI Foundry. MBAs and undergrads who forge AI strategy — and ship production systems for real clients.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BYU AI Foundry" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Foundry | Where MBAs forge AI strategy",
    description: "BYU Marriott's AI Foundry — forging intelligent solutions.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
