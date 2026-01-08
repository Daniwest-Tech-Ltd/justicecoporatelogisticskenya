import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  Users, 
  Fuel, 
  Settings, 
  Gauge, 
  Check, 
  MessageCircle,
  Shield,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Car,
  Loader2,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import RentalModal from "@/components/rental/RentalModal";

interface Vehicle {
  id: string;
  name: string;
  category: string;
  price_per_day: number;
  price_per_week: number | null;
  price_per_month: number | null;
  driver_fee: number | null;
  image_url: string | null;
  description: string | null;
  features: string[] | null;
  seats: number;
  fuel_type: string;
  transmission: string;
  status: string;
  year: number | null;
  engine_cc: number | null;
  model: string | null;
}

interface VehicleImage {
  id: string;
  image_url: string;
  display_order: number;
}

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [images, setImages] = useState<VehicleImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showRentalModal, setShowRentalModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchVehicle();
      fetchVehicleImages();
    }
  }, [id]);

  const fetchVehicle = async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setVehicle(data);
    }
    setLoading(false);
  };

  const fetchVehicleImages = async () => {
    const { data } = await supabase
      .from("vehicle_images")
      .select("*")
      .eq("vehicle_id", id)
      .order("display_order");

    if (data) {
      setImages(data);
    }
  };

  const allImages = vehicle?.image_url 
    ? [{ id: "main", image_url: vehicle.image_url, display_order: -1 }, ...images]
    : images;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE").format(price);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!vehicle) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Car className="w-20 h-20 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h1 className="section-title mb-4">Vehicle Not Found</h1>
          <p className="text-muted-foreground mb-6">The vehicle you're looking for doesn't exist or has been removed.</p>
          <Link to="/catalogue" className="btn-primary-gradient inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back to Catalogue
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors glass-button px-4 py-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image with Navigation */}
            <div className="glass-card overflow-hidden relative group">
              {allImages.length > 0 ? (
                <>
                  <img
                    src={allImages[currentImageIndex]?.image_url}
                    alt={vehicle.name}
                    className="w-full h-80 lg:h-[450px] object-cover"
                  />
                  
                  {/* Navigation Arrows */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 hover:bg-background text-foreground transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 hover:bg-background text-foreground transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-background/80 text-sm font-medium">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-80 lg:h-[450px] flex items-center justify-center bg-muted">
                  <Car className="w-20 h-20 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? "border-primary" 
                        : "border-transparent hover:border-muted-foreground/50"
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={`${vehicle.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="glass-card px-3 py-1 text-sm font-medium">
                  {vehicle.category}
                </span>
                {vehicle.status === "available" ? (
                  <span className="badge-available">✅ Available</span>
                ) : (
                  <span className="badge-booked">⛔ Booked</span>
                )}
              </div>
              <h1 className="font-heading text-3xl lg:text-4xl font-bold mb-2">
                {vehicle.name}
              </h1>
              {vehicle.year && (
                <p className="text-muted-foreground text-lg">Year: {vehicle.year}</p>
              )}
            </div>

            {/* Quick Contact */}
            <div className="glass-card p-4 space-y-2">
              <a 
                href="tel:+254702575512"
                className="w-full btn-primary-gradient py-3 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                +254 702 575 512
              </a>
              <a 
                href="mailto:justicecoporatelogisticskenya@gmail.com"
                className="w-full glass-button py-3 flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Email Us
              </a>
              <a
                href="https://wa.me/254702575512"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full glass-button py-3 flex items-center justify-center gap-2 text-green-500 hover:bg-green-500/10"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </div>

            {/* Pricing */}
            <div className="glass-card p-6">
              <p className="text-primary font-bold text-3xl mb-2">
                KSh {formatPrice(vehicle.price_per_day)}
                <span className="text-lg font-normal text-muted-foreground">/day</span>
              </p>
              {vehicle.price_per_week && (
                <p className="text-muted-foreground">
                  Weekly: KSh {formatPrice(vehicle.price_per_week)}
                </p>
              )}
              {vehicle.price_per_month && (
                <p className="text-muted-foreground">
                  Monthly: KSh {formatPrice(vehicle.price_per_month)}
                </p>
              )}
              {vehicle.driver_fee && vehicle.driver_fee > 0 && (
                <p className="text-muted-foreground mt-2">
                  Driver Fee: +KSh {formatPrice(vehicle.driver_fee)}/day
                </p>
              )}
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Insurance included • No hidden charges</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {vehicle.status === "available" ? (
                <button
                  onClick={() => setShowRentalModal(true)}
                  className="flex-1 btn-primary-gradient flex items-center justify-center gap-2 py-4 text-lg"
                >
                  <Calendar className="w-5 h-5" />
                  Rent This Vehicle
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 glass-button py-4 text-lg opacity-50 cursor-not-allowed"
                >
                  Currently Unavailable
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="mt-12 glass-card p-6">
          <h2 className="font-heading text-2xl font-bold mb-6">Overview</h2>
          
          {/* Specs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <p className="text-sm text-muted-foreground">Make</p>
              <p className="font-semibold">{vehicle.name.split(' ')[0]}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Model</p>
              <p className="font-semibold">{vehicle.model || vehicle.name.split(' ').slice(1).join(' ') || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Year</p>
              <p className="font-semibold">{vehicle.year || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fuel Type</p>
              <p className="font-semibold">{vehicle.fuel_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transmission</p>
              <p className="font-semibold">{vehicle.transmission}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Seats</p>
              <p className="font-semibold">{vehicle.seats} Passengers</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Engine</p>
              <p className="font-semibold">{vehicle.engine_cc ? `${vehicle.engine_cc}CC` : 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-semibold">{vehicle.category}</p>
            </div>
          </div>

          {/* Features */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div>
              <h3 className="font-heading font-semibold mb-4">Features</h3>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.map((feature, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-sm"
                  >
                    <Check className="w-3 h-3 text-green-500" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {vehicle.description && (
            <div className="mt-6">
              <h3 className="font-heading font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{vehicle.description}</p>
            </div>
          )}
        </div>

        {/* Location & Contact */}
        <div className="mt-8 glass-card p-6">
          <h2 className="font-heading text-xl font-bold mb-4">Visit Us</h2>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Mpesi Lane 11, Westlands, Nairobi</p>
              <p className="text-sm text-muted-foreground">Kenya</p>
            </div>
          </div>
        </div>

        {/* Back to Catalogue */}
        <div className="mt-8 text-center">
          <Link to="/catalogue" className="btn-primary-gradient inline-flex items-center gap-2 px-8 py-3">
            <ArrowLeft className="w-5 h-5" />
            Back to Catalogue
          </Link>
        </div>
      </div>

      {/* Rental Modal */}
      <RentalModal
        isOpen={showRentalModal}
        onClose={() => setShowRentalModal(false)}
        vehicle={vehicle}
      />
    </Layout>
  );
};

export default VehicleDetails;
