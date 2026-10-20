import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, MapPin, MessageCircle, Send, Activity, ShieldCheck, Clock } from "lucide-react";
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
        title: "Submission Error",
        description: "Failed to send message. Please reach out via call or WhatsApp directly.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting Justice Corporate Logistics Kenya. Our team will respond shortly.",
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
        <div className="fixed inset-0 z-0">
          <img
            src="/rental 2.png"
            alt="Corporate Support Terminal"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black z-10" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-24">
          <div className="flex flex-col items-center text-center mb-24 space-y-6">
            <div className="data-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-red" />
              Corporate Contact & Dispatch Center
            </div>
            <h1 className="heading-executive">
              Contact <span className="text-primary">Justice.</span>
            </h1>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-white/70 leading-relaxed max-w-2xl mx-auto bg-black/40 backdrop-blur-sm p-4 border border-white/5 rounded-sm">
              Connect with our Nairobi office for instant vehicle rental bookings, corporate fleet leasing,
              long-term institutional inquiries, or 24/7 roadside assistance.
            </p>
            <div className="red-divider mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-12 bg-primary group-hover:h-full transition-all duration-700" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-3">
                  <Activity className="w-4 h-4" />
                  Corporate Office Contacts
                </h2>

                <div className="space-y-6">
                  {[
                    { icon: Phone, label: "Main Phone Hotline", value: "+254 702 575 512", href: "tel:0702575512" },
                    { icon: MessageCircle, label: "WhatsApp Direct Line", value: "+254 722 827 458", href: "https://wa.me/254722827458" },
                    { icon: Mail, label: "Official Email Address", value: "info@justicecorporatelogistics.co.ke", href: "mailto:info@justicecorporatelogistics.co.ke" },
                    { icon: MapPin, label: "Physical Address", value: "Muthithi Road, Westlands, Nairobi, Kenya", href: "https://maps.app.goo.gl/A9knQzufbtdy8cqX6" },
                  ].map((item, idx) => (
                    <div key={idx} className="group/item">
                      <span className="block text-[8px] font-bold uppercase tracking-widest text-white/30 mb-1">{item.label}</span>
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

              <div className="p-6 border border-white/10 bg-black/20 backdrop-blur-[2px] rounded-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Hours of Operation</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-green-500 animate-pulse" />
                    <span className="text-[9px] font-black text-green-500 uppercase">Dispatch Ready</span>
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex justify-between text-[10px] font-mono text-white/60 uppercase tracking-widest">
                    <span>Monday - Saturday:</span>
                    <span>08:00 AM - 06:00 PM</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-white/60 uppercase tracking-widest">
                    <span>Sunday & Holidays:</span>
                    <span>09:00 AM - 04:00 PM</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-primary uppercase tracking-widest pt-2">
                    <span>Emergency Hotline:</span>
                    <span>24/7 Active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-8 md:p-12 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm relative overflow-hidden h-full">
                <div className="flex items-center gap-4 mb-8">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-black uppercase tracking-widest text-white">Send Us An Inquiry</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-sm h-14 px-6 text-[11px] font-bold tracking-widest text-white placeholder:text-white/20 focus:border-primary/50 transition-all outline-none uppercase"
                        placeholder="e.g. JOHN DOE"
                        title="Full Name"
                        aria-label="Full Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-sm h-14 px-6 text-[11px] font-bold tracking-widest text-white placeholder:text-white/20 focus:border-primary/50 transition-all outline-none uppercase"
                        placeholder="NAME@DOMAIN.COM"
                        title="Email Address"
                        aria-label="Email Address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-sm h-14 px-6 text-[11px] font-bold tracking-widest text-white placeholder:text-white/20 focus:border-primary/50 transition-all outline-none uppercase"
                        placeholder="+254 700 000 000"
                        title="Phone Number"
                        aria-label="Phone Number"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Inquiry Category *</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-sm h-14 px-6 text-[11px] font-bold tracking-widest text-white focus:border-primary/50 transition-all outline-none uppercase appearance-none"
                        title="Inquiry Category"
                        aria-label="Category"
                      >
                        <option value="" className="bg-black">SELECT INQUIRY TYPE</option>
                        <option value="Car Rental Reservation" className="bg-black">Car Rental Reservation</option>
                        <option value="Corporate Fleet Leasing" className="bg-black">Corporate Fleet Leasing</option>
                        <option value="Chauffeur Services" className="bg-black">Chauffeur Services</option>
                        <option value="Long Term Lease Quote" className="bg-black">Long Term Lease Quote</option>
                        <option value="General Inquiry" className="bg-black">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Message Details *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-sm p-6 text-[11px] font-bold tracking-widest text-white placeholder:text-white/20 focus:border-primary/50 transition-all outline-none uppercase resize-none"
                      placeholder="ENTER YOUR SPECIFIC VEHICLE RENTAL OR LOGISTICS REQUIREMENTS..."
                      title="Message Details"
                      aria-label="Message Details"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-white h-16 rounded-sm font-black uppercase tracking-[0.4em] text-[11px] transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>SENDING MESSAGE...</span>
                    ) : (
                      <>
                        <Send className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        Send Inquiry
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Interactive Google Map Frame */}
          <div className="p-4 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Interactive Location Map — Westlands, Nairobi
            </h3>
            <div className="w-full h-80 rounded-sm overflow-hidden border border-white/5">
              <iframe
                title="Justice Corporate Logistics Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.823616654763!2d36.808027!3d-1.266531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f173c3f3f3f3f%3A0x0!2sMuthithi%20Rd%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(0.8) contrast(1.2) invert(0.9)" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
