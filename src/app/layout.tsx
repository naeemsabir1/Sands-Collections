import type { Metadata } from "next";
import { Playfair_Display, Inter, Dancing_Script } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sands Collections | Luxury Pakistani Fashion",
  description: "Discover premium Pakistani fashion - Men's & Women's Stitched and Unstitched collections, Fragrances, Ihram Collection. Shop the finest fabrics and designs.",
  keywords: "Pakistani fashion, luxury clothing, men's fashion, women's fashion, fragrances, ihram, unstitched fabric, stitched suits",
  openGraph: {
    title: "Sands Collections | Luxury Pakistani Fashion",
    description: "Discover premium Pakistani fashion - Men's & Women's collections, Fragrances & Ihram Collection",
    type: "website",
    locale: "en_PK",
    siteName: "Sands Collections",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} ${dancing.variable} font-inter antialiased bg-white selection:bg-gold-primary/30`}
      >
        {/* Static subtle gradient - GPU friendly (replaces heavy blur orbs) */}
        <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-br from-cream/30 via-transparent to-gold-primary/5" />

        <CartProvider>
          <WishlistProvider>
            <Navbar />
            <main className="min-h-screen relative z-0 pt-32 md:pt-36">
              {children}
            </main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}

