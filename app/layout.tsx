import { Header } from "@/app/components/Header";
import { CartProvider } from "@/lib/CartContext";
import "./globals.css";

// ... (keep your metadata)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <CartProvider>
          <Header /> {/* <--- Add this here */}
          {children}
        </CartProvider>
      </body>
    </html>
  );
}