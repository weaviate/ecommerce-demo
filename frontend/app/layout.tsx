import "./globals.css";

import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import Navbar from "../components/navigation/Navbar";
import { CartProvider } from "../contexts/CartContext";
import { FaHeart } from "react-icons/fa";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weaviate E-Commerce",
  description: "E-Commerce demo by Weaviate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="mytheme">
      <body className={roboto.className}>
        <CartProvider>
          <Navbar />
          {children}

          <footer className="w-full p-4 bg-black border-t shadow md:flex md:items-center md:justify-between md:p-6">
            <span className="flex flex-row text-sm text-white sm:text-center">
              <FaHeart size={16} className="text-red-500 mr-2" />
              Built with Weaviate and love
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-white sm:mt-0">
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Licensing
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
