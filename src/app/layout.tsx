import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/components/theme-provider";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { Analytics } from "@vercel/analytics/react";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://voltsstore.vercel.app"),
  title: {
    default: "Volts Store | Premium Workspace & Tech Essentials",
    template: "%s | Volts Store"
  },
  description: "Discover premium mechanical keyboards, monitors, audio gear, and studio accessories designed for creators, professionals, and gamers.",
  keywords: ["volts store", "workspace tech", "mechanical keyboards", "ultrawide monitors", "audiophile headphones", "desk accessories", "studio setup"],
  authors: [{ name: "Volts Store Team" }],
  openGraph: {
    title: "Volts Store | Premium Workspace & Tech Essentials",
    description: "Discover premium mechanical keyboards, monitors, audio gear, and studio accessories designed for creators, professionals, and gamers.",
    url: "https://voltsstore.vercel.app",
    siteName: "Volts Store",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Volts Store | Premium Workspace & Tech Essentials",
    description: "Discover premium mechanical keyboards, monitors, audio gear, and studio accessories designed for creators, professionals, and gamers.",
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
      <body className={`${inter.variable} ${sora.variable} font-sans min-h-screen bg-background text-foreground flex flex-col`}>
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