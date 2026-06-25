import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  Users, 
  Fuel, 
  Settings, 
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
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Decrypting Asset Data...</p>
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
      <div className="min-h-screen bg-black relative">
        {/* Background Visual Asset */}
        <div className="fixed inset-0 z-0">
          <img
            src="/rental.png"
            alt="Terminal Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-10" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-32">
          {/* VAT Marquee Announcement */}
          <div className="bg-green-600/10 border-y border-green-500/20 py-3 mb-8 overflow-hidden">
            <div className="animate-marquee inline-block whitespace-nowrap">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-green-500 mx-10">
                16% Added VAT Included on all transactions // Executive Protocol v2.6 // Terminal Active
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-green-500 mx-10">
                16% Added VAT Included on all transactions // Executive Protocol v2.6 // Terminal Active
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-green-500 mx-10">
                16% Added VAT Included on all transactions // Executive Protocol v2.6 // Terminal Active
              </span>
            </div>
          </div>

          {/* Back Button */}
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors glass-button px-4 py-2 text-[10px] font-black uppercase tracking-widest border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalogue
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="border border-white/10 bg-black/40 backdrop-blur-md p-2 rounded-sm overflow-hidden relative group">
                {allImages.length > 0 ? (
                  <>
                    <img
                      src={allImages[currentImageIndex]?.image_url}
                      alt={vehicle.name}
                      className="w-full h-80 lg:h-[450px] object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                    />

                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-sm bg-black/60 border border-white/10 hover:bg-primary text-white transition-all opacity-0 group-hover:opacity-100"
                          title="Previous Image"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-sm bg-black/60 border border-white/10 hover:bg-primary text-white transition-all opacity-0 group-hover:opacity-100"
                          title="Next Image"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}

                    {allImages.length > 1 && (
                      <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 border border-white/10 rounded-sm text-[10px] font-mono text-white/70">
                        {currentImageIndex + 1} / {allImages.length}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-80 lg:h-[450px] flex items-center justify-center bg-white/5">
                    <Car className="w-20 h-20 text-white/10" />
                  </div>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {allImages.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border transition-all ${
                        index === currentImageIndex
                          ? "border-primary"
                          : "border-white/10 hover:border-white/30"
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
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="data-badge py-1 px-3">
                    {vehicle.category}
                  </span>
                  <span className={`px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest border ${
                    vehicle.status === "available" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                  }`}>
                    {vehicle.status === "available" ? "Available" : "Booked"}
                  </span>
                </div>
                <h1 className="heading-executive text-3xl lg:text-5xl mb-2">
                  {vehicle.name}
                </h1>
                {vehicle.year && (
                  <p className="text-white/40 font-mono text-sm tracking-widest">REGISTRY YEAR: {vehicle.year}</p>
                )}
              </div>

              {/* Pricing Terminal */}
              <div className="p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm">
                <div className="text-3xl font-black text-white mb-2">
                  <span className="text-xs text-primary mr-2 font-bold uppercase">KSh</span>
                  {formatPrice(vehicle.price_per_day)}
                  <span className="text-xs font-normal text-white/20 uppercase tracking-widest ml-2">/ Deployment Day</span>
                </div>
                <p className="text-[10px] font-mono text-green-500 uppercase tracking-widest mb-6">16% Added VAT Included</p>

                <div className="space-y-3 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>Comprehensive Protection Protocol Included</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    <Check className="w-4 h-4 text-primary" />
                    <span>No Hidden Transactional Charges</span>
                  </div>
                </div>
              </div>

              {/* Secure Comms Link */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href="tel:+254702575512"
                  className="btn-outline-terminal h-14 flex items-center justify-center gap-3 px-4"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-[10px]">Call</span>
                </a>
                <a
                  href="mailto:info@justiceultimateautomobiles.com"
                  className="btn-outline-terminal h-14 flex items-center justify-center gap-3 px-4"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-[10px]">Email</span>
                </a>
                <a
                  href="https://wa.me/254702575512"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-terminal h-14 flex items-center justify-center gap-3 px-4 text-green-500 hover:border-green-500/50"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-[10px]">WhatsApp</span>
                </a>
              </div>

              {/* Deployment Trigger */}
              <div className="pt-4">
                {vehicle.status === "available" ? (
                  <button
                    onClick={() => setShowRentalModal(true)}
                    className="btn-scan w-full h-16 flex items-center justify-center gap-4 text-lg"
                  >
                    <Calendar className="w-5 h-5" />
                    Initiate Deployment
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full h-16 bg-white/5 border border-white/10 text-white/20 font-black uppercase tracking-widest cursor-not-allowed"
                  >
                    Asset Currently Engaged
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Technical Overview Section */}
          <div className="mt-16 p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm">
            <h2 className="text-xl font-black uppercase tracking-widest text-white mb-10 pb-4 border-b border-white/5">Unit Technical Overview</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {[
                { label: "Make", value: vehicle.name.split(' ')[0] },
                { label: "Model", value: vehicle.model || vehicle.name.split(' ').slice(1).join(' ') || 'N/A' },
                { label: "Registry Year", value: vehicle.year || 'N/A' },
                { label: "Energy Cell", value: vehicle.fuel_type },
                { label: "Drive System", value: vehicle.transmission },
                { label: "Unit Capacity", value: `${vehicle.seats} Personnel` },
                { label: "Engine Displacement", value: vehicle.engine_cc ? `${vehicle.engine_cc}CC` : 'N/A' },
                { label: "Deployment Sector", value: vehicle.category },
              ].map((spec) => (
                <div key={spec.label}>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">{spec.label}</p>
                  <p className="text-sm font-black uppercase tracking-widest text-white">{spec.value}</p>
                </div>
              ))}
            </div>

            {vehicle.features && vehicle.features.length > 0 && (
              <div className="mt-16">
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-6">Tactical Features Registry</h3>
                <div className="flex flex-wrap gap-3">
                  {vehicle.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-3 px-4 py-2 border border-white/5 bg-white/[0.02] text-[10px] font-bold uppercase tracking-widest text-white/60"
                    >
                      <Check className="w-3 h-3 text-primary" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {vehicle.description && (
              <div className="mt-16 pt-10 border-t border-white/5">
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-4">Logistical Summary</h3>
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/40 leading-relaxed max-w-4xl">{vehicle.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedVehicle && (
        <RentalModal
          isOpen={showRentalModal}
          onClose={() => setShowRentalModal(false)}
          vehicle={vehicle}
        />
      )}
    </Layout>
  );
};

export default VehicleDetails;
