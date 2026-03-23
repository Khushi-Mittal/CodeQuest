import { Suspense } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div style={{height: '80px', background: '#1e293b'}}></div>}>
          <Navbar />
        </Suspense>
        
        {children}
        <Footer />
      </body>
    </html>
  );
}