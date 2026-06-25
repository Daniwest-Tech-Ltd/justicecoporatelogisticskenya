import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Download,
  Heart,
  User,
  Sun,
  LogIn
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Rental", path: "/catalogue" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10 py-3 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Justice Corporate Logistics" className="h-10 w-auto transition-transform group-hover:scale-105" />
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-black uppercase tracking-tighter text-white">Justice Corporate</span>
              <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-primary">Logistics Kenya</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-sm ${
                  isActive(link.path)
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Terminal */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-red" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Service Active</span>
            </div>

            {/* Icon Group */}
            <div className="flex items-center gap-1">
              <button className="p-2.5 text-white/50 hover:text-white hover:bg-white/5 rounded-sm transition-all">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2.5 text-white/50 hover:text-white hover:bg-white/5 rounded-sm transition-all">
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {/* Auth/User Actions */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="text-[9px] font-black uppercase tracking-[0.2em] text-primary hover:underline">Admin Panel</Link>
                  )}
                  <button onClick={signOut} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 rounded-sm transition-all">
                    <User className="w-3 h-3" />
                    Disconnect
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 rounded-sm transition-all">
                  <LogIn className="w-3.5 h-3.5" />
                  Authenticate
                </Link>
              )}
              <button className="p-2.5 text-white/50 border border-white/10 rounded-sm hover:bg-white/5 transition-all">
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Trigger */}
          <button className="lg:hidden p-2 text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 animate-fade-up">
          <nav className="p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block text-[11px] font-black uppercase tracking-[0.3em] ${
                  isActive(link.path) ? "text-primary" : "text-white/60"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
              {!user && (
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] bg-primary text-white text-center rounded-sm">Execute Log In</Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
