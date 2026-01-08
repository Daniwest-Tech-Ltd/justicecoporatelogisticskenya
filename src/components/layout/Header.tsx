import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Clock, Home, Car, Info, Mail, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

const navLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "Rental Catalogue", path: "/catalogue", icon: Car },
  { name: "About", path: "/about", icon: Info },
  { name: "Contact", path: "/contact", icon: Mail },
];

const workingHours = {
  sunday: { open: "10:30", close: "16:00" },
  monday: { open: "09:00", close: "17:00" },
  tuesday: { open: "09:00", close: "17:00" },
  wednesday: { open: "09:00", close: "17:00" },
  thursday: { open: "09:00", close: "17:00" },
  friday: { open: "09:00", close: "17:00" },
  saturday: { open: "09:00", close: "16:00" },
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();
  const [timeUntilClose, setTimeUntilClose] = useState("");

  const isActive = (path: string) => location.pathname === path;

  const getCurrentStatus = () => {
    const now = new Date();
    const day = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() as keyof typeof workingHours;
    const hours = workingHours[day];
    
    const [openHour, openMin] = hours.open.split(":").map(Number);
    const [closeHour, closeMin] = hours.close.split(":").map(Number);
    
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;

    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      const remaining = closeMinutes - currentMinutes;
      const h = Math.floor(remaining / 60);
      const m = remaining % 60;
      const s = 59 - now.getSeconds();
      return { isOpen: true, countdown: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}` };
    }
    return { isOpen: false, countdown: "" };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const status = getCurrentStatus();
      setTimeUntilClose(status.countdown);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const status = getCurrentStatus();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <header className="glass-nav">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Justice Corporate Logistics Kenya" className="h-12 w-auto" />
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className={`nav-link font-medium ${isActive(link.path) ? "text-primary active" : ""}`}>
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${status.isOpen ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                <span className={`w-2 h-2 rounded-full ${status.isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                {status.isOpen ? "OPEN" : "CLOSED"}
                {status.isOpen && timeUntilClose && <span className="ml-1 font-mono text-xs">{timeUntilClose}</span>}
              </div>

              <a href="tel:0702575512" className="flex items-center gap-2 glass-button text-sm">
                <Phone className="w-4 h-4" />
                <span>0702575512</span>
              </a>

              {user ? (
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Link to="/admin" className="glass-button text-sm px-4">Admin</Link>
                  )}
                  <button onClick={signOut} className="btn-primary-gradient text-sm">Sign Out</button>
                </div>
              ) : (
                <Link to="/login" className="btn-primary-gradient text-sm">Sign In</Link>
              )}
            </div>

            <button className="lg:hidden glass-button p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Left Side Panel Menu - Professional Design */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Side Panel */}
          <div className="absolute top-0 left-0 bottom-0 w-72 bg-card/95 backdrop-blur-xl border-r border-border/50 animate-slide-in-left flex flex-col">
            {/* Header with Logo */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="h-10 w-auto" />
              </Link>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Title */}
            <div className="px-4 py-3 border-b border-border/50">
              <h3 className="font-heading text-lg font-bold text-foreground">Menu</h3>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path + index}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-lg transition-all ${
                    isActive(link.path) 
                      ? "bg-primary text-primary-foreground font-semibold" 
                      : "hover:bg-muted/80 text-foreground"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="text-base">{link.name}</span>
                </Link>
              ))}
              
              {/* Admin Link */}
              {user && isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 px-4 py-4 rounded-lg hover:bg-muted/80 text-foreground transition-all"
                >
                  <User className="w-5 h-5" />
                  <span className="text-base">Admin Dashboard</span>
                </Link>
              )}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-border/50 space-y-3">
              {/* Status Indicator */}
              <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                status.isOpen ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              }`}>
                <span className={`w-2 h-2 rounded-full ${status.isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                {status.isOpen ? "OPEN" : "CLOSED"}
                {status.isOpen && timeUntilClose && <span className="ml-2 font-mono">{timeUntilClose}</span>}
              </div>

              {/* Auth Button */}
              {user ? (
                <button 
                  onClick={() => { signOut(); setIsOpen(false); }} 
                  className="btn-primary-gradient w-full py-4 flex items-center justify-center gap-3 rounded-lg font-semibold"
                >
                  <User className="w-5 h-5" />
                  Sign Out
                </button>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)} 
                  className="btn-primary-gradient w-full py-4 flex items-center justify-center gap-3 rounded-lg font-semibold"
                >
                  <User className="w-5 h-5" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Header;
