import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { vehicles } from "@/data/vehicles";
import { 
  ArrowLeft, 
  Users, 
  Fuel, 
  Settings, 
  Gauge, 
  Check, 
  MessageCircle,
  Shield,
  Calendar
} from "lucide-react";

const VehicleDetails = () => {
  const { id } = useParams();
  const vehicle = vehicles.find((v) => v.id === id);

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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="glass-card overflow-hidden">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-80 lg:h-[500px] object-cover"
              />
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="glass-card px-3 py-1 text-sm font-medium">
                  {vehicle.category}
                </span>
                {vehicle.status === "available" ? (
                  <span className="badge-available">✅ Available</span>
                ) : (
                  <span className="badge-booked">⛔ Booked</span>
                )}
              </div>
              <h1 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
                {vehicle.name}
              </h1>
            </div>

            {/* Specs Grid */}
            <div className="glass-card p-6">
              <h3 className="font-heading font-semibold mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Seats</p>
                    <p className="font-medium">{vehicle.seats} Passengers</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Transmission</p>
                    <p className="font-medium">{vehicle.transmission}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Fuel className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fuel Type</p>
                    <p className="font-medium">{vehicle.fuel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Gauge className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Engine</p>
                    <p className="font-medium">{vehicle.engine}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="glass-card p-6">
              <h3 className="font-heading font-semibold mb-4">Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {vehicle.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="glass-card p-6">
              <h3 className="font-heading font-semibold mb-4">Rental Pricing</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Daily Rate</span>
                  <span className="font-bold text-xl">KSh {formatPrice(vehicle.pricePerDay)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Weekly Rate</span>
                  <span className="font-bold text-lg">KSh {formatPrice(vehicle.pricePerWeek)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Driver Fee (Optional)</span>
                  <span className="font-medium">+ KSh {formatPrice(vehicle.driverFee)}/day</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Insurance included • No hidden charges</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              {vehicle.status === "available" ? (
                <Link
                  to={`/book/${vehicle.id}`}
                  className="flex-1 btn-primary-gradient flex items-center justify-center gap-2 py-4 text-lg"
                >
                  <Calendar className="w-5 h-5" />
                  Rent This Vehicle
                </Link>
              ) : (
                <button
                  disabled
                  className="flex-1 glass-button py-4 text-lg opacity-50 cursor-not-allowed"
                >
                  Currently Unavailable
                </button>
              )}
              <a
                href="https://wa.me/254702575512"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 glass-button flex items-center justify-center gap-2 py-4 text-lg hover:bg-green-500/20"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Inquiry
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VehicleDetails;
