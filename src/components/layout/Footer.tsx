import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Search, Youtube, ShieldCheck } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="relative bg-black pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Background Visual Asset */}
      <div className="absolute inset-0 z-0">
        <img
          src="/rental 2.png"
          alt="Terminal Footer Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black z-10" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">

          {/* Brand Identity Module */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Justice Ultimate" className="h-12 w-auto" />
              <div className="flex flex-col">
                <span className="text-xl font-black uppercase tracking-tighter text-white">Justice Corporate</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Logistics Kenya</span>
              </div>
            </div>

            <p className="text-[11px] font-bold uppercase tracking-widest leading-relaxed text-white/50 max-w-sm">
              Africa's premier automotive transactional terminal.
              Specializing in high-fidelity logistical infrastructure,
              corporate fleet scaling, and encrypted logistics management.
            </p>

            <div className="space-y-4 pt-4">
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0047AB]">Inventory Audit Search</h5>
              <div className="flex items-center gap-2 max-w-xs p-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-sm focus-within:border-primary/50 transition-all">
                <div className="pl-3">
                  <Search className="w-4 h-4 text-primary" />
                </div>
                <input
                  type="text"
                  placeholder="VIN, MAKE OR MODEL..."
                  className="flex-1 bg-transparent border-none text-[10px] font-bold tracking-widest text-white placeholder:text-white/20 focus:ring-0 uppercase h-10"
                />
                <button className="bg-primary hover:bg-primary/90 text-white text-[9px] font-black uppercase tracking-widest px-4 h-10 rounded-sm transition-all">
                  Query
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Matrix */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-8">
              <h5 className="footer-section-title">Business Units</h5>
              <ul className="space-y-4">
                {[
                  { name: "Rental Fleet", path: "/catalogue" },
                  { name: "Corporate Desk", path: "/about" },
                  { name: "Dispatch Hub", path: "/contact" },
                  { name: "Terminal Entry", path: "/login" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="footer-link">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h5 className="footer-section-title">Operational Hubs</h5>
              <ul className="space-y-4">
                {[
                  "Nairobi Operations",
                  "Mombasa Operations",
                  "Kisumu Operations",
                  "Eldoret Operations",
                  "Nyeri Operations",
                ].map((hub) => (
                  <li key={hub} className="footer-link cursor-default opacity-60">
                    <MapPin className="w-3.5 h-3.5 text-primary/40" />
                    {hub}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Executive Support Terminal */}
          <div className="lg:col-span-4">
            <div className="p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-sm h-full relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-8 bg-primary group-hover:h-full transition-all duration-700" />
              <h5 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-10 text-center">Executive Support</h5>

              <div className="space-y-6">
                <div className="flex items-center gap-5 p-4 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all rounded-sm">
                  <div className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-sm">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold uppercase tracking-widest text-white/20 mb-1">Corporate Line</span>
                    <a href="tel:0702575512" className="text-xs font-black tracking-widest text-white hover:text-primary transition-all">0702575512</a>
                  </div>
                </div>

                <div className="flex items-center gap-5 p-4 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all rounded-sm">
                  <div className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-sm">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold uppercase tracking-widest text-white/20 mb-1">Secure Email</span>
                    <a href="mailto:justicevincentt@gmail.com" className="text-[9px] font-black tracking-widest text-white hover:text-primary transition-all uppercase">justicevincentt@gmail.com</a>
                  </div>
                </div>

                {/* Social Audit Interface */}
                <div className="flex justify-between items-center pt-6">
                  {[
                    { icon: Facebook, href: "#" },
                    { icon: Instagram, href: "#" },
                    { icon: Twitter, href: "#" },
                    { icon: Youtube, href: "#" },
                  ].map((social, idx) => (
                    <a key={idx} href={social.href} className="w-10 h-10 flex items-center justify-center border border-white/10 bg-white/[0.03] rounded-sm hover:border-primary/50 transition-all">
                      <social.icon className="w-4 h-4 text-white/40" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Legal Protocol */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
              © {new Date().getFullYear()} Justice Corporate Logistics Kenya. Transactional Authority Active.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex gap-8">
              <Link to="/terms" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-primary transition-all">Service Protocols</Link>
              <Link to="/privacy" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-primary transition-all">Data Encryption</Link>
            </div>
            <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20 italic">
              Powered by <a href="https://github.com/maishdan" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Daniwest Tech Ltd</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
