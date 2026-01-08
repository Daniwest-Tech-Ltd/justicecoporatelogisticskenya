import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Clock, Home, Car, Info, Mail, User, ChevronDown } from "lucide-react";
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

const dayOrder = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHoursDropdown, setShowHoursDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  const isActive = (path: string) => location.pathname === path;

  const getCurrentStatus = () => {
    const now = currentTime;
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
      return { 
        isOpen: true, 
        countdown: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
        label: "Closing in"
      };
    }
    
    // Calculate time until next opening
    const dayIndex = now.getDay();
    let nextOpenDay = dayIndex;
    let daysUntilOpen = 0;
    
    // Check if we can still open today
    if (currentMinutes < openMinutes) {
      // We haven't opened yet today
      const remaining = openMinutes - currentMinutes;
      const h = Math.floor(remaining / 60);
      const m = remaining % 60;
      const s = 59 - now.getSeconds();
      return { 
        isOpen: false, 
        countdown: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
        label: "Opens in"
      };
    }
    
    // Find next day we're open
    for (let i = 1; i <= 7; i++) {
      const checkDay = (dayIndex + i) % 7;
      const dayName = dayOrder[checkDay];
      const dayHours = workingHours[dayName];
      if (dayHours) {
        nextOpenDay = checkDay;
        daysUntilOpen = i;
        break;
      }
    }
    
    const nextDayName = dayOrder[nextOpenDay];
    const nextHours = workingHours[nextDayName];
    const [nextOpenHour, nextOpenMin] = nextHours.open.split(":").map(Number);
    
    // Calculate remaining time
    const remainingToday = 24 * 60 - currentMinutes;
    const fullDays = (daysUntilOpen - 1) * 24 * 60;
    const nextDayMinutes = nextOpenHour * 60 + nextOpenMin;
    const totalRemaining = remainingToday + fullDays + nextDayMinutes;
    
    const h = Math.floor(totalRemaining / 60);
    const m = totalRemaining % 60;
    
    return { 
      isOpen: false, 
      countdown: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:00`,
      label: "Opens in"
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowHoursDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const status = getCurrentStatus();
  const currentDay = currentTime.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

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

  const formatTime = (time: string) => {
    const [hour, min] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
  };

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
              {/* Working Hours Button with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowHoursDropdown(!showHoursDropdown)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    status.isOpen 
                      ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" 
                      : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${status.isOpen ? "bg-green-500 animate-pulse" : "bg-red-500 animate-pulse"}`} />
                  {status.isOpen ? "OPEN" : "CLOSED"}
                  <span className="ml-1 font-mono text-xs">{status.countdown}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showHoursDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {showHoursDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-foreground" />
                        <span className="font-semibold text-foreground">Working Hours</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        status.isOpen ? "bg-green-500 text-white" : "bg-red-500 text-white"
                      }`}>
                        {status.isOpen ? "OPEN NOW" : "CLOSED"}
                      </span>
                    </div>

                    {/* Countdown */}
                    <div className={`mx-4 mt-4 p-4 rounded-xl text-center ${
                      status.isOpen ? "bg-blue-500/20" : "bg-red-500/20"
                    }`}>
                      <p className="text-sm text-muted-foreground mb-1">{status.label}</p>
                      <p className={`text-2xl font-mono font-bold ${
                        status.isOpen ? "text-blue-400" : "text-red-400"
                      }`}>
                        {status.countdown}
                      </p>
                    </div>

                    {/* Hours List */}
                    <div className="p-4 space-y-2">
                      {dayOrder.map((day) => {
                        const hours = workingHours[day];
                        const isToday = day === currentDay;
                        return (
                          <div 
                            key={day} 
                            className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                              isToday ? "bg-primary/10 text-primary" : ""
                            }`}
                          >
                            <span className={`capitalize ${isToday ? "font-semibold" : ""}`}>
                              {day.charAt(0).toUpperCase() + day.slice(1)}
                            </span>
                            <span className={isToday ? "font-semibold" : "text-muted-foreground"}>
                              {formatTime(hours.open)} – {formatTime(hours.close)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Contact */}
                    <div className="p-4 border-t border-border">
                      <a 
                        href="tel:0702575512" 
                        className="flex items-center justify-center gap-2 text-primary font-medium hover:underline"
                      >
                        <Phone className="w-4 h-4" />
                        Contact: 0702575512
                      </a>
                    </div>
                  </div>
                )}
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
              {/* Status Indicator - Clickable */}
              <button
                onClick={() => setShowHoursDropdown(!showHoursDropdown)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                  status.isOpen ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${status.isOpen ? "bg-green-500 animate-pulse" : "bg-red-500 animate-pulse"}`} />
                {status.isOpen ? "OPEN" : "CLOSED"}
                <span className="ml-2 font-mono">{status.countdown}</span>
              </button>

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
