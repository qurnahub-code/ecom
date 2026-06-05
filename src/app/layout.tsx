import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/components/theme-provider";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { Analytics } from "@vercel/analytics/react";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://voltsstore.vercel.app"),
  title: {
    default: "Volts Store | Premium Workspace Tech Gear",
    template: "%s | Volts Store"
  },
  description: "Discover next-level mechanical keyboards, high-performance gaming gear, monitors, and workspace accessories. Shop high-quality products with fast shipping and secure checkout.",
  keywords: ["volts store", "workspace tech", "mechanical keyboards", "gaming mouse", "audiophile gear", "desk accessories"],
  authors: [{ name: "Volts Store Team" }],
  openGraph: {
    title: "Volts Store | Premium Workspace Tech Gear",
    description: "Discover next-level mechanical keyboards, high-performance gaming gear, monitors, and workspace accessories.",
    url: "https://voltsstore.vercel.app",
    siteName: "Volts Store",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Volts Store | Premium Workspace Tech Gear",
    description: "Discover next-level mechanical keyboards, high-performance gaming gear, monitors, and workspace accessories.",
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
              <WhatsAppButton />
            </CartProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}