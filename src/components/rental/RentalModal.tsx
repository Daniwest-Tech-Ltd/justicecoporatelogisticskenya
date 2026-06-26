import { useState } from "react";
import { X, Calendar, MapPin, Phone, Mail, MessageCircle, User, CheckCircle, AlertCircle, Zap, ShieldCheck, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface RentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: {
    id: string;
    name: string;
    price_per_day: number;
    image_url?: string | null;
  };
}

const RentalModal = ({ isOpen, onClose, vehicle }: RentalModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    preferred_contact: "whatsapp",
    pickup_date: "",
    return_date: "",
    pickup_location: "",
    notes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the Terms of Service to proceed.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    const { error } = await supabase.from("rental_orders").insert([
      {
        vehicle_id: vehicle.id,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        preferred_contact: formData.preferred_contact,
        pickup_date: formData.pickup_date,
        return_date: formData.return_date,
        pickup_location: formData.pickup_location,
        notes: formData.notes,
      },
    ]);

    if (error) {
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again or contact us directly.",
        variant: "destructive",
      });
    } else {
      try {
        await supabase.functions.invoke("send-notification", {
          body: {
            to: formData.customer_email,
            subject: "Booking Request Received - Justice Corporate Logistics",
            type: "booking_confirmation",
            data: {
              customerName: formData.customer_name,
              vehicleName: vehicle.name,
              pickupDate: formData.pickup_date,
              returnDate: formData.return_date,
            },
          },
        });
      } catch (emailError) {
        console.error("Email notification failure:", emailError);
      }
      setShowSuccess(true);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setShowSuccess(false);
    setAgreedToTerms(false);
    setFormData({
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      preferred_contact: "whatsapp",
      pickup_date: "",
      return_date: "",
      pickup_location: "",
      notes: "",
    });
    onClose();
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={handleClose} />
        <div className="relative bg-black border border-white/10 rounded-sm w-full max-w-lg p-10 text-center shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-pulse" />
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-4">Request Sent! 🎉</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-10 leading-relaxed">
            Thank you for choosing Justice Corporate Logistics Kenya. We have received your rental request.
          </p>

          <div className="bg-white/[0.02] border border-white/5 p-6 mb-10 text-left space-y-5 rounded-sm">
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">What's Next?</h3>
            
            <div className="flex items-start gap-4">
              <Mail className="w-4 h-4 text-white/20 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                Check your email (<span className="text-white">{formData.customer_email}</span>) for confirmation once your rental is approved.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-4 h-4 text-white/20 flex-shrink-0 mt-0.5" />
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                <p>For immediate assistance, call us:</p>
                <a href="tel:+254702575512" className="text-primary font-bold hover:underline">0702 575 512</a>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <a
              href="https://wa.me/254702575512"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 btn-outline-terminal h-14 flex items-center justify-center gap-3 text-green-500 hover:border-green-500/50"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
            <button
              onClick={handleClose}
              className="flex-1 btn-scan h-14"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-black border border-white/10 rounded-sm w-full max-w-xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-white/[0.01] flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Rent This Vehicle</h2>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{vehicle.name}</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/30 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Vehicle Info Summary */}
        <div className="p-6 border-b border-white/10 bg-white/[0.01]">
          <div className="flex gap-6 items-center">
            {vehicle.image_url && (
              <img src={vehicle.image_url} alt={vehicle.name} className="w-24 h-16 object-cover border border-white/10 rounded-sm" />
            )}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">{vehicle.name}</h3>
              <p className="text-primary font-black text-xl tracking-tighter">KSh {vehicle.price_per_day.toLocaleString()}/day</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Your Details */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Your Details</h4>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    placeholder="ENTER YOUR FULL NAME"
                    required
                    className="audit-input w-full h-12 pl-12 bg-white/[0.03] border border-white/10 rounded-sm text-[10px] outline-none focus:border-primary/50 uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                  <input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    placeholder="john@example.com"
                    required
                    className="audit-input w-full h-12 pl-12 bg-white/[0.03] border border-white/10 rounded-sm text-[10px] outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Phone Number (e.g., 0722827458) *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                  <input
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    placeholder="07XX XXX XXX"
                    required
                    className="audit-input w-full h-12 pl-12 bg-white/[0.03] border border-white/10 rounded-sm text-[10px] outline-none focus:border-primary/50 uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Communication Protocol */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">How should we contact you?</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
                { value: "email", label: "Email", icon: Mail },
                { value: "sms", label: "SMS", icon: Phone },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, preferred_contact: value })}
                  className={`flex flex-col items-center justify-center gap-2 py-4 border rounded-sm transition-all ${
                    formData.preferred_contact === value
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-white/5 border-white/10 text-white/30 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rental Dates */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Rental Dates</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[8px] font-bold uppercase tracking-widest text-white/20 ml-1">Pickup Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                  <input
                    type="date"
                    value={formData.pickup_date}
                    onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="audit-input w-full h-12 pl-12 bg-white/[0.03] border border-white/10 rounded-sm text-[10px] outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-bold uppercase tracking-widest text-white/20 ml-1">Return Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                  <input
                    type="date"
                    value={formData.return_date}
                    onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                    required
                    min={formData.pickup_date || new Date().toISOString().split("T")[0]}
                    className="audit-input w-full h-12 pl-12 bg-white/[0.03] border border-white/10 rounded-sm text-[10px] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[8px] font-bold uppercase tracking-widest text-white/20 ml-1">Pickup Location (e.g., JKIA, Westlands)</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                <input
                  type="text"
                  value={formData.pickup_location}
                  onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                  placeholder="SPECIFY LOCATION"
                  className="audit-input w-full h-12 pl-12 bg-white/[0.03] border border-white/10 rounded-sm text-[10px] outline-none focus:border-primary/50 uppercase"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Additional Notes (Optional)</h4>
            <div className="space-y-2">
              <label className="text-[8px] font-bold uppercase tracking-widest text-white/20 ml-1">Any special requests or requirements... (e.g., need a driver, airport pickup, child seat)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="audit-input w-full bg-white/[0.03] border border-white/10 rounded-sm p-6 text-[10px] outline-none focus:border-primary/50 resize-none uppercase"
                placeholder="ENTER LOGISTICAL CONSTRAINTS..."
              />
            </div>
          </div>

          {/* Confirmation Info Box */}
          <div className="flex items-start gap-4 p-6 border border-primary/20 bg-primary/5 rounded-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/60 leading-relaxed">
              After submitting, you'll receive a confirmation email. Our team will review your request and contact you within 24 hours.
            </p>
          </div>

          {/* Submit & Terms */}
          <div className="space-y-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 border rounded-sm flex items-center justify-center transition-all ${agreedToTerms ? 'bg-primary border-primary' : 'border-white/20 bg-white/5 group-hover:border-primary/50'}`}>
                {agreedToTerms && <Check className="w-3 h-3 text-white" />}
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="hidden"
                />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">
                By submitting, you agree to our <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="w-full btn-scan h-16 text-sm flex items-center justify-center gap-4 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? "TRANSMITTING..." : "Submit Booking Request"}
              {!loading && <Zap className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RentalModal;
