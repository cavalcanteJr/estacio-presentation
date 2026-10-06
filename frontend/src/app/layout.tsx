import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import BugReportModal from "@/components/BugReportModal";

export const metadata: Metadata = {
  title: "TechMarket | E-commerce Oficial de Tecnologia",
  description: "Marketplace moderno de tecnologia e eletrônicos de alta performance com múltiplos lojistas parceiros.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-cyber-dark text-slate-100 antialiased min-h-screen flex flex-col selection:bg-sky-500 selection:text-white">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <BugReportModal />
            <div className="flex-1">
              {children}
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

