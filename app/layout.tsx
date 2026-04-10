import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

export const metadata = {
  title: "The Truth Platform",
  description: "Where truth lives",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <AuthProvider>
            <Navbar />
            {/* الخريطة subtley في الخلف */}
            <div className="background-map"></div>
            {/* المحتوى فوق الخريطة */}
            <div className="content-container">{children}</div>
            <Footer />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}