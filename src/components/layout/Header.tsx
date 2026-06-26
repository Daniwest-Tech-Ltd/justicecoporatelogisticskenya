import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Download,
  Heart,
  User,
  Sun,
  LogIn,
  Home,
  Car,
  Info,
  Mail,
  ShieldCheck,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

const navLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "Rental", path: "/catalogue", icon: Car },
  { name: "About", path: "/about", icon: Info },
  { name: "Contact", path: "/contact", icon: Mail },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10 py-3 transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Trigger (Left Side) */}
            <button
              className="lg:hidden p-2 text-white/70 hover:text-white"
              onClick={() => setIsOpen(true)}
              title="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 group">
              <img src={logo} alt="Justice Corporate Logistics" className="h-10 w-auto transition-transform group-hover:scale-105" />
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-black uppercase tracking-tighter text-white">Justice Corporate</span>
                <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-primary">Logistics Kenya</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
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
              <div className="flex items-center gap-2 px-3 py-1.5 border border-green-500/20 bg-green-500/10 rounded-sm">
                <span className="text-[8px] font-black uppercase tracking-widest text-green-500">VAT 16% Included</span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-red" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Service Active</span>
              </div>

              <div className="flex items-center gap-1">
                <button className="p-2.5 text-white/50 hover:text-white hover:bg-white/5 rounded-sm transition-all" title="Download Resource">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2.5 text-white/50 hover:text-white hover:bg-white/5 rounded-sm transition-all" title="View Wishlist">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

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
                <button className="p-2.5 text-white/50 border border-white/10 rounded-sm hover:bg-white/5 transition-all" title="Toggle Theme">
                  <Sun className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Left Side) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Side Panel */}
          <div className="absolute top-0 left-0 bottom-0 w-[280px] bg-black border-r border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Logo" className="h-8 w-auto" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white uppercase tracking-tighter">Justice Terminal</span>
                  <span className="text-[7px] font-bold text-primary uppercase tracking-[0.3em]">Mobile Node</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/30 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Registry */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <span className="block text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-2">Mission Sectors</span>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-sm transition-all ${
                    isActive(link.path)
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <link.icon className={`w-5 h-5 ${isActive(link.path) ? "text-primary" : "text-white/20"}`} />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">{link.name}</span>
                </Link>
              ))}

              {/* Admin Sector */}
              {user && isAdmin && (
                <>
                  <div className="h-[1px] bg-white/5 my-6 mx-2" />
                  <span className="block text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-2">Admin Command</span>
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 px-4 py-4 text-primary hover:bg-primary/10 rounded-sm transition-all"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Admin Panel</span>
                  </Link>
                </>
              )}
            </nav>

            {/* Personnel Interface (Bottom) */}
            <div className="p-6 border-t border-white/10 space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">{user ? 'Authenticated' : 'Guest Mode'}</span>
                  <span className="text-[7px] font-mono text-white/20 uppercase truncate max-w-[150px]">{user ? user.email : 'Awaiting Login'}</span>
                </div>
              </div>

              {user ? (
                <button
                  onClick={() => { signOut(); setIsOpen(false); }}
                  className="w-full h-12 flex items-center justify-center gap-3 border border-red-500/20 bg-red-500/5 text-red-500 rounded-sm font-black uppercase tracking-[0.3em] text-[10px] hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full h-12 flex items-center justify-center gap-3 bg-primary text-white rounded-sm font-black uppercase tracking-[0.3em] text-[10px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <LogIn className="w-4 h-4" />
                  Authenticate
                </Link>
              )}

              <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/5 opacity-30">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em]">Transactional Security Active</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
