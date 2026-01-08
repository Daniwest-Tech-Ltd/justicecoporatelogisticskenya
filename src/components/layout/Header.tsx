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
      return { isOpen: true, countdown: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:00` };
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

      {/* Mobile Bottom Sheet Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl p-6 animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-lg font-bold">Menu</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="space-y-2 mb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${isActive(link.path) ? "bg-primary/20 text-primary" : "hover:bg-muted"}`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                  {isActive(link.path) && <span className="ml-auto w-2 h-2 rounded-full bg-primary" />}
                </Link>
              ))}
            </nav>

            {user ? (
              <div className="space-y-2">
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-4 rounded-xl hover:bg-muted w-full">
                    <User className="w-5 h-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <button onClick={() => { signOut(); setIsOpen(false); }} className="btn-primary-gradient w-full py-4 flex items-center justify-center gap-2">
                  <User className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="btn-primary-gradient w-full py-4 flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
