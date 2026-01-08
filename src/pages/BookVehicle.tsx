import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { vehicles } from "@/data/vehicles";
import { ArrowLeft, Calendar, MapPin, User, Check, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const locations = [
  "Nairobi CBD",
  "Westlands",
  "JKIA Airport",
  "Karen",
  "Nyeri",
  "Mombasa",
];

const BookVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const vehicle = vehicles.find((v) => v.id === id);

  const [formData, setFormData] = useState({
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
    returnLocation: "",
    driverRequired: false,
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!vehicle) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="section-title mb-4">Vehicle Not Found</h1>
          <Link to="/catalogue" className="btn-primary-gradient inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back to Catalogue
          </Link>
        </div>
      </Layout>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE").format(price);
  };

  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 0;
    const pickup = new Date(formData.pickupDate);
    const returnD = new Date(formData.returnDate);
    const diff = Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const days = calculateDays();
  const vehicleCost = days * vehicle.pricePerDay;
  const driverCost = formData.driverRequired ? days * vehicle.driverFee : 0;
  const totalCost = vehicleCost + driverCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate booking submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "Booking Request Submitted!",
      description: "We'll contact you shortly to confirm your reservation.",
    });

    setIsSubmitting(false);
    navigate("/");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          to={`/vehicle/${vehicle.id}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Vehicle Details
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8">
              <h1 className="font-heading text-2xl font-bold mb-6">Book {vehicle.name}</h1>

              {/* Rental Details */}
              <div className="mb-8">
                <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Rental Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pickup Date *</label>
                    <input
                      type="date"
                      value={formData.pickupDate}
                      onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="glass-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Return Date *</label>
                    <input
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                      required
                      min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                      className="glass-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pickup Location *</label>
                    <select
                      value={formData.pickupLocation}
                      onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                      required
                      className="glass-input"
                    >
                      <option value="">Select Location</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Return Location *</label>
                    <select
                      value={formData.returnLocation}
                      onChange={(e) => setFormData({ ...formData, returnLocation: e.target.value })}
                      required
                      className="glass-input"
                    >
                      <option value="">Select Location</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Driver Option */}
                <label className="flex items-center gap-3 mt-4 cursor-pointer glass-card p-4 hover:bg-white/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.driverRequired}
                    onChange={(e) => setFormData({ ...formData, driverRequired: e.target.checked })}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Add Professional Driver</p>
                    <p className="text-sm text-muted-foreground">+ KSh {formatPrice(vehicle.driverFee)}/day</p>
                  </div>
                </label>
              </div>

              {/* Personal Details */}
              <div className="mb-8">
                <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="glass-input"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="glass-input"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="glass-input"
                      placeholder="0700 000 000"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Additional Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="glass-input resize-none"
                      placeholder="Any special requests or requirements..."
                    />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 mb-6 cursor-pointer">
                <input type="checkbox" required className="w-5 h-5 rounded border-border mt-0.5 accent-primary" />
                <span className="text-sm text-muted-foreground">
                  I agree to the rental terms and conditions, and understand that this is a booking request subject to availability confirmation.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || days === 0}
                className="btn-primary-gradient w-full py-4 text-lg disabled:opacity-50"
              >
                {isSubmitting ? "Submitting Request..." : "Submit Booking Request"}
              </button>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h2 className="font-heading font-semibold text-lg mb-4">Booking Summary</h2>

              {/* Vehicle */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-border/50">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-24 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-medium">{vehicle.name}</h3>
                  <p className="text-sm text-muted-foreground">{vehicle.category}</p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{days} day{days !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vehicle ({days} × KSh {formatPrice(vehicle.pricePerDay)})</span>
                  <span>KSh {formatPrice(vehicleCost)}</span>
                </div>
                {formData.driverRequired && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Driver ({days} × KSh {formatPrice(vehicle.driverFee)})</span>
                    <span>KSh {formatPrice(driverCost)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-border/50">
                  <span>Total</span>
                  <span className="text-primary">KSh {formatPrice(totalCost)}</span>
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/254702575512?text=Hi, I want to book ${vehicle.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button w-full flex items-center justify-center gap-2 py-3 hover:bg-green-500/20"
              >
                <MessageCircle className="w-5 h-5" />
                Inquire via WhatsApp
              </a>

              {/* Inclusions */}
              <div className="mt-6 pt-6 border-t border-border/50">
                <p className="text-sm font-medium mb-3">Included:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {["Comprehensive Insurance", "24/7 Support", "Free Cancellation (48hrs)", "No Hidden Charges"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookVehicle;
