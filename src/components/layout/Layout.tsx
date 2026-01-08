import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import heroBg from "@/assets/hero-bg.jpg";

interface LayoutProps {
  children: ReactNode;
  showBackground?: boolean;
}

const Layout = ({ children, showBackground = true }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      {showBackground && (
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="hero-overlay" />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
