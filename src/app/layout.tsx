import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/components/theme-provider";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://voltsstore.vercel.app"),
  title: {
    default: "E-Com Platform | Premium Electronics & Tech Gear",
    template: "%s | E-Com Platform"
  },
  description: "Discover next-level electronics and tech gear. From mechanical keyboards to high-performance gaming gear, shop high-quality products with fast global shipping and secure checkout.",
  keywords: ["ecommerce", "tech gear", "electronics", "mechanical keyboards", "gaming mouse", "high quality tech"],
  authors: [{ name: "E-Com Platform Team" }],
  openGraph: {
    title: "E-Com Platform | Premium Electronics & Tech Gear",
    description: "Discover next-level electronics and tech gear. Shop high-quality products with fast global shipping and secure checkout.",
    url: "https://voltsstore.vercel.app",
    siteName: "E-Com Platform",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Com Platform | Premium Electronics & Tech Gear",
    description: "Discover next-level electronics and tech gear. Shop high-quality products with fast global shipping and secure checkout.",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "p1LFen-UD2LnVH4cf2tKYLkUo9uMIi3nIyJjFxR7oTo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <CartProvider>
              <Navbar />
              
              <main className="flex-grow">
                {children}
              </main>

              <Footer />
              <Analytics />
            </CartProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}