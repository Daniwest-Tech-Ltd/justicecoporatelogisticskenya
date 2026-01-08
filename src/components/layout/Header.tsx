import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Clock } from "lucide-react";
import logo from "@/assets/logo.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Rental Catalogue", path: "/catalogue" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const getCurrentStatus = () => {
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 20) {
      return { isOpen: true, text: "Open Now" };
    }
    return { isOpen: false, text: "Closed" };
  };

  const status = getCurrentStatus();

  return (
    <header className="glass-nav">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Justice Corporate Logistics Kenya" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link font-medium ${isActive(link.path) ? "text-primary active" : ""}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Business Status */}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className={status.isOpen ? "text-green-500" : "text-red-500"}>
                {status.text}
              </span>
            </div>

            {/* Phone */}
            <a
              href="tel:0702575512"
              className="flex items-center gap-2 glass-button text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>0702575512</span>
            </a>

            {/* Auth Button */}
            <Link to="/login" className="btn-primary-gradient text-sm">
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden glass-button p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`py-2 font-medium ${isActive(link.path) ? "text-primary" : "text-foreground/80"}`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                <a
                  href="tel:0702575512"
                  className="flex items-center gap-2 glass-button justify-center"
                >
                  <Phone className="w-4 h-4" />
                  <span>0702575512</span>
                </a>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary-gradient text-center"
                >
                  Sign In
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
