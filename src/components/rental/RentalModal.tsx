import { useState } from "react";
import { X, Calendar, MapPin, Phone, Mail, MessageCircle, User } from "lucide-react";
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
            subject: "Booking Confirmation - Justice Corporate Logistics",
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

      toast({
        title: "Booking Request Sent! 🎉",
        description: "We'll contact you shortly to confirm your rental. A confirmation email has been sent!",
      });
      onClose();
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
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between rounded-t-2xl">
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
                className="glass-input pl-10"
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
                className="glass-input pl-10"
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
                className="glass-input pl-10"
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
                    className="glass-input pl-10"
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
                    className="glass-input pl-10"
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
                className="glass-input pl-10"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Additional Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="glass-input resize-none"
              placeholder="Any special requests or requirements..."
            />
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
            By submitting, you agree to our Terms of Service. We'll confirm availability within 24 hours.
          </p>
        </form>
      </div>
    </div>
  );
};

export default RentalModal;
