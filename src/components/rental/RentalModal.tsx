import { useState } from "react";
import { X, Calendar, MapPin, Phone, Mail, MessageCircle, User, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
    setLoading(true);

    const { error } = await supabase.from("rental_orders").insert([
      {
        vehicle_id: vehicle.id,
        ...formData,
      },
    ]);

    if (error) {
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again or contact us directly.",
        variant: "destructive",
      });
    } else {
      // Send confirmation email
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
        console.error("Email notification failed:", emailError);
      }

      setShowSuccess(true);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setShowSuccess(false);
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

  // Success Screen
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
        <div className="relative bg-card rounded-2xl w-full max-w-md p-8 text-center shadow-2xl">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          
          <h2 className="font-heading text-2xl font-bold mb-3">Booking Request Sent! 🎉</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for choosing Justice Corporate Logistics Kenya. We have received your rental request.
          </p>

          <div className="glass-card p-4 mb-6 text-left space-y-3">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">What's Next?</h3>
            
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                Check your email (<span className="font-medium">{formData.customer_email}</span>) for confirmation once your rental is approved.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p>For immediate assistance, call us:</p>
                <a href="tel:+254702575512" className="font-bold text-primary hover:underline">
                  0702 575 512
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p>Visit our office:</p>
                <p className="font-medium">Mpesi Lane 11, Westlands, Nairobi</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href="https://wa.me/254702575512"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 glass-button py-3 flex items-center justify-center gap-2 text-green-500 hover:bg-green-500/10"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
            <button
              onClick={handleClose}
              className="flex-1 btn-primary-gradient py-3"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="font-heading text-xl font-bold">Rent This Vehicle</h2>
            <p className="text-sm text-muted-foreground">{vehicle.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle Info */}
        <div className="p-4 border-b border-border">
          <div className="flex gap-4">
            {vehicle.image_url && (
              <img src={vehicle.image_url} alt={vehicle.name} className="w-24 h-20 object-cover rounded-lg" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold">{vehicle.name}</h3>
              <p className="text-primary font-bold text-lg">KSh {vehicle.price_per_day.toLocaleString()}/day</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Personal Details */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Your Details</h4>
            
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                placeholder="Full Name *"
                required
                className="glass-input pl-10 bg-background"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                placeholder="Email Address *"
                required
                className="glass-input pl-10 bg-background"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="tel"
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                placeholder="Phone Number (e.g., 0722827458) *"
                required
                className="glass-input pl-10 bg-background"
              />
            </div>
          </div>

          {/* Contact Preference */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">How should we contact you?</h4>
            <div className="flex gap-2">
              {[
                { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
                { value: "email", label: "Email", icon: Mail },
                { value: "sms", label: "SMS", icon: Phone },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, preferred_contact: value })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    formData.preferred_contact === value
                      ? "bg-primary text-primary-foreground"
                      : "glass-button text-muted-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Rental Details */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Rental Dates</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Pickup Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="date"
                    value={formData.pickup_date}
                    onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="glass-input pl-10 bg-background"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Return Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="date"
                    value={formData.return_date}
                    onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                    required
                    min={formData.pickup_date || new Date().toISOString().split("T")[0]}
                    className="glass-input pl-10 bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={formData.pickup_location}
                onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                placeholder="Pickup Location (e.g., JKIA, Westlands)"
                className="glass-input pl-10 bg-background"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Additional Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="glass-input resize-none bg-background"
              placeholder="Any special requests or requirements... (e.g., need a driver, airport pickup, child seat)"
            />
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              After submitting, you'll receive a confirmation email. Our team will review your request and contact you within 24 hours.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary-gradient py-3 font-semibold disabled:opacity-50"
          >
            {loading ? "Sending Request..." : "Submit Booking Request"}
          </button>

          <p className="text-xs text-center text-muted-foreground">
            By submitting, you agree to our Terms of Service.
          </p>
        </form>
      </div>
    </div>
  );
};

export default RentalModal;
