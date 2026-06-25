import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Activity, ShieldCheck, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from("contact_messages")
      .insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
      }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you shortly.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black relative">
        {/* Background Visual Asset */}
        <div className="fixed inset-0 z-0">
          <img
            src="/rental 2.png"
            alt="Logistical Support Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black z-10" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-24">
          {/* Header Interface */}
          <div className="flex flex-col items-center text-center mb-24 space-y-6">
            <div className="data-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-red" />
              Communication Hub & Dispatch Terminal
            </div>
            <h1 className="heading-executive">
              Contact <span className="text-primary">Justice.</span>
            </h1>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-white/70 leading-relaxed max-w-2xl mx-auto bg-black/40 backdrop-blur-sm p-4 border border-white/5 rounded-sm">
              Operational 24/7. Connect with Africa's premier automotive transactional
              terminal for immediate logistical fulfillment and fleet scaling requirements.
            </p>
            <div className="red-divider mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Tactical Support Module */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-12 bg-primary group-hover:h-full transition-all duration-700" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-3">
                  <Activity className="w-4 h-4" />
                  Support Terminal
                </h2>

                <div className="space-y-8">
                  {[
                    { icon: Phone, label: "Dispatch Line", value: "0702575512", href: "tel:0702575512" },
                    { icon: Mail, label: "Secure Email", value: "justicevincentt@gmail.com", href: "mailto:justicevincentt@gmail.com" },
                    { icon: MapPin, label: "Operational Hub", value: "Occidental Plaza, Nairobi", href: "https://maps.app.goo.gl/A9knQzufbtdy8cqX6" },
                    { icon: MessageCircle, label: "WhatsApp Secure", value: "0722 827 458", href: "https://wa.me/254722827458" }
                  ].map((item, idx) => (
                    <div key={idx} className="group/item">
                      <span className="block text-[8px] font-bold uppercase tracking-widest text-white/20 mb-2">{item.label}</span>
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white hover:text-primary transition-all">
                        <div className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-sm group-hover/item:bg-primary/20 transition-all">
                          <item.icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest leading-tight">{item.value}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Block */}
              <div className="p-6 border border-white/10 bg-black/20 backdrop-blur-[2px] rounded-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Terminal Status</span>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-black text-green-500 uppercase">Online</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono text-white/20 uppercase tracking-widest">
                    <span>Mon - Sat</span>
                    <span>09:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-white/20 uppercase tracking-widest">
                    <span>Sun</span>
                    <span>10:30 - 16:00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Transmission Terminal */}
            <div className="lg:col-span-8">
              <div className="p-8 md:p-12 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Zap className="w-4 h-4 text-white/5 opacity-50" />
                </div>

                <div className="flex items-center gap-4 mb-10">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-black uppercase tracking-widest text-white">Execute Message Transmission</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Personnel Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-sm h-14 px-6 text-[11px] font-bold tracking-widest text-white placeholder:text-white/10 focus:border-primary/50 transition-all outline-none uppercase"
                        placeholder="AUTHENTICATED NAME"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Dispatch Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-sm h-14 px-6 text-[11px] font-bold tracking-widest text-white placeholder:text-white/10 focus:border-primary/50 transition-all outline-none uppercase"
                        placeholder="COMMUNICATION NODE"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Operational Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-sm h-14 px-6 text-[11px] font-bold tracking-widest text-white placeholder:text-white/10 focus:border-primary/50 transition-all outline-none uppercase"
                        placeholder="+254 OPERATIONAL CODE"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Mission Sector</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-sm h-14 px-6 text-[11px] font-bold tracking-widest text-white focus:border-primary/50 transition-all outline-none uppercase appearance-none"
                      >
                        <option value="" className="bg-black">SELECT SECTOR</option>
                        <option value="booking" className="bg-black">NEW DEPLOYMENT INQUIRY</option>
                        <option value="corporate" className="bg-black">CORPORATE LOGISTICS</option>
                        <option value="support" className="bg-black">TACTICAL SUPPORT</option>
                        <option value="feedback" className="bg-black">MISSION FEEDBACK</option>
                        <option value="other" className="bg-black">GENERAL OVERVIEW</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Message Content</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-sm p-6 text-[11px] font-bold tracking-widest text-white placeholder:text-white/10 focus:border-primary/50 transition-all outline-none uppercase resize-none"
                      placeholder="ENTER DETAILED LOGISTICAL REQUIREMENTS..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-white h-16 rounded-sm font-black uppercase tracking-[0.4em] text-[11px] transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>TRANSMITTING...</span>
                    ) : (
                      <>
                        <Send className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                        Execute Transmission
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
