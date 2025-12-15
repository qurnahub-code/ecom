import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider"; // [NEW] Import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modern Ecommerce Platform",
  description: "Built with Next.js and Prisma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50 flex flex-col`}>
        {/* [NEW] Wrap everything in NextAuthProvider */}
        <NextAuthProvider>
          <CartProvider>
            <Navbar />
            
            <main className="flex-grow">
              {children}
            </main>

            <Footer />
          </CartProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}