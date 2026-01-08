import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Github } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="relative mt-20">
      <div className="glass-card rounded-none border-x-0 border-b-0">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="space-y-4">
              <img src={logo} alt="Justice Corporate Logistics Kenya" className="h-16 w-auto" />
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your trusted partner for premium car rental services in Kenya. NTSA compliant fleet with fully insured vehicles.
              </p>
              <div className="flex gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="glass-button p-2 hover:text-primary transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="glass-button p-2 hover:text-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="glass-button p-2 hover:text-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { name: "Home", path: "/" },
                  { name: "Rental Catalogue", path: "/catalogue" },
                  { name: "About Us", path: "/about" },
                  { name: "Contact", path: "/contact" },
                ].map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Our Services</h4>
              <ul className="space-y-3">
                {[
                  { name: "Self Drive Rentals", path: "/catalogue?service=self-drive" },
                  { name: "Chauffeur Driven", path: "/catalogue?service=chauffeur" },
                  { name: "Corporate Rentals", path: "/catalogue?service=corporate" },
                  { name: "Event Transportation", path: "/catalogue?service=events" },
                  { name: "Long-Term Leasing", path: "/catalogue?service=leasing" },
                ].map((service) => (
                  <li key={service.name}>
                    <Link to={service.path} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Call Us</p>
                    <a href="tel:0702575512" className="font-medium hover:text-primary transition-colors">0702575512</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a href="mailto:justicevincentt@gmail.com" className="font-medium hover:text-primary transition-colors text-sm">
                      justicevincentt@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <a href="https://maps.app.goo.gl/A9knQzufbtdy8cqX6" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary transition-colors">
                      Occidental Plaza, Muthithi Rd, Nairobi
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Justice Corporate Logistics Kenya. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Rental</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground italic">
              Powered By Daniwest Tech Sol{" "}
              <a href="https://github.com/maishdan" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                <Github className="w-4 h-4" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
