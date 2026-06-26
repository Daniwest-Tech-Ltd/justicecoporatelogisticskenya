import { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Activity,
  Zap,
  Check,
  Calendar,
  Phone,
  Mail,
  MessageCircle,
  Users,
  Settings,
  Fuel,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import RentalModal from "../rental/RentalModal";

interface Vehicle {
  id: string;
  name: string;
  category: string;
  price_per_day: number;
  price_per_week: number | null;
  price_per_month: number | null;
  image_url: string | null;
  description: string | null;
  features: string[] | null;
  seats: number;
  fuel_type: string;
  transmission: string;
  status: string;
  year: number | null;
  model: string | null;
  engine_cc: number | null;
}

interface VehicleImage {
  id: string;
  image_url: string;
  display_order: number;
}

interface VehicleDetailsOverlayProps {
  vehicle: Vehicle;
  onClose: () => void;
  allVehicles: Vehicle[];
  onSelectUnit: (vehicle: Vehicle) => void;
}

const VehicleDetailsOverlay = ({ vehicle, onClose, allVehicles, onSelectUnit }: VehicleDetailsOverlayProps) => {
  const [images, setImages] = useState<VehicleImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showRentalModal, setShowRentalModal] = useState(false);

  useEffect(() => {
    fetchVehicleImages();
    // Prevent body scroll when overlay is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [vehicle.id]);

  const fetchVehicleImages = async () => {
    const { data } = await supabase
      .from("vehicle_images")
      .select("*")
      .eq("vehicle_id", vehicle.id)
      .order("display_order");

    if (data) {
      setImages(data);
    } else {
      setImages([]);
    }
  };

  const allImages = vehicle.image_url
    ? [{ id: "main", image_url: vehicle.image_url, display_order: -1 }, ...images]
    : images;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE").format(price);
  };

  const recommendedVehicles = allVehicles
    .filter(v => v.id !== vehicle.id && v.category === vehicle.category)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col overflow-y-auto custom-scrollbar animate-fade-up">
      {/* Background Visual Asset */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/rental.png"
          alt="Terminal Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-10" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 lg:py-16">
        {/* Navigation Interface */}
        <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="data-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-red" />
              Unit Details Interface // SECURE_NODE_{vehicle.id.substring(0, 4)}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 border border-white/10 bg-white/5 hover:bg-primary hover:text-white transition-all rounded-sm flex items-center gap-3 group"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block">Close Terminal</span>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VAT Marquee */}
        <div className="bg-green-600/10 border-y border-green-500/20 py-3 mb-12 overflow-hidden">
          <div className="animate-marquee inline-block whitespace-nowrap">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-green-500 mx-10">
              16% Added VAT Included on all transactions // Executive Protocol v2.6 // Terminal Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
          {/* Visual Data Module */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border border-white/10 bg-black/40 backdrop-blur-md p-2 rounded-sm overflow-hidden relative group">
              {allImages.length > 0 ? (
                <>
                  <img
                    src={allImages[currentImageIndex]?.image_url}
                    alt={vehicle.name}
                    className="w-full aspect-video object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                  />
                  {allImages.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={prevImage} className="p-3 bg-black/60 border border-white/10 text-white hover:bg-primary transition-all"><ChevronLeft /></button>
                      <button onClick={nextImage} className="p-3 bg-black/60 border border-white/10 text-white hover:bg-primary transition-all"><ChevronRight /></button>
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 border border-white/10 rounded-sm text-[10px] font-mono text-white/70">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                </>
              ) : (
                <div className="w-full aspect-video flex items-center justify-center bg-white/5">
                  <span className="text-white/10 font-black text-xs tracking-widest">VISUAL N/A</span>
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-24 h-20 border transition-all ${
                      index === currentImageIndex ? "border-primary" : "border-white/10"
                    }`}
                  >
                    <img src={img.image_url} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tactical Specs Module */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="heading-executive text-4xl lg:text-6xl text-white">{vehicle.name}</h2>
              <div className="flex items-center gap-4">
                <span className="data-badge py-1 px-3 border-none bg-primary/20">{vehicle.category} Unit</span>
                <span className={`px-3 py-1 border rounded-sm text-[9px] font-black uppercase tracking-widest ${
                  vehicle.status === 'available' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5'
                }`}>
                  Status: {vehicle.status}
                </span>
              </div>
            </div>

            {/* Pricing Matrix */}
            <div className="p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm space-y-6">
              <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Daily Cycle</span>
                <div className="text-right">
                  <p className="text-2xl font-black text-white"><span className="text-xs text-primary mr-1">KSh</span>{formatPrice(vehicle.price_per_day)}</p>
                </div>
              </div>
              {vehicle.price_per_week && (
                <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Weekly Deployment</span>
                  <div className="text-right">
                    <p className="text-xl font-black text-white/80"><span className="text-xs text-primary mr-1">KSh</span>{formatPrice(vehicle.price_per_week)}</p>
                  </div>
                </div>
              )}
              {vehicle.price_per_month && (
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Monthly Strategic</span>
                  <div className="text-right">
                    <p className="text-xl font-black text-white/60"><span className="text-xs text-primary mr-1">KSh</span>{formatPrice(vehicle.price_per_month)}</p>
                  </div>
                </div>
              )}
              <div className="pt-4 text-center">
                <p className="text-[10px] font-mono text-green-500 uppercase tracking-[0.3em]">VAT 16% Included in displayed rates</p>
              </div>
            </div>

            <button
              onClick={() => setShowRentalModal(true)}
              disabled={vehicle.status !== 'available'}
              className="w-full btn-scan h-20 flex items-center justify-center gap-6 text-xl"
            >
              <Zap className="w-6 h-6" />
              Execute Rental Now
            </button>
          </div>
        </div>

        {/* Detailed Tactical Overview */}
        <div className="p-10 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm mb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5"><Activity className="w-32 h-32" /></div>
          <h3 className="text-xl font-black uppercase tracking-widest text-white mb-12 flex items-center gap-4">
            <Settings className="w-6 h-6 text-primary" />
            Unit Technical Registry
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            {[
              { label: "Make/Brand", value: vehicle.name.split(' ')[0], icon: ShieldCheck },
              { label: "Model Code", value: vehicle.model || "VERIFIED", icon: Activity },
              { label: "Registry Year", value: vehicle.year || "2023", icon: Calendar },
              { label: "Seating Capacity", value: `${vehicle.seats} Personnel`, icon: Users },
              { label: "Drive System", value: vehicle.transmission, icon: Settings },
              { label: "Energy Cell", value: vehicle.fuel_type, icon: Fuel },
              { label: "Engine Displacement", value: vehicle.engine_cc ? `${vehicle.engine_cc}CC` : "N/A", icon: Activity },
              { label: "Fleet Sector", value: vehicle.category, icon: ShieldCheck },
            ].map((spec) => (
              <div key={spec.label} className="space-y-3">
                <div className="flex items-center gap-2 text-white/20">
                  <spec.icon className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">{spec.label}</span>
                </div>
                <p className="text-sm font-black uppercase tracking-widest text-white">{spec.value}</p>
              </div>
            ))}
          </div>

          {vehicle.description && (
            <div className="pt-12 border-t border-white/5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Logistical Mission Summary</h4>
              <p className="text-sm font-bold uppercase tracking-widest text-white/50 leading-relaxed max-w-4xl">{vehicle.description}</p>
            </div>
          )}
        </div>

        {/* You May Also Like Section */}
        {recommendedVehicles.length > 0 && (
          <div className="space-y-12">
            <div className="flex items-center gap-6">
              <h3 className="text-2xl font-black uppercase tracking-widest text-white">Suggested Strategic Units</h3>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recommendedVehicles.map((v, index) => (
                <div
                  key={v.id}
                  className="unit-card group cursor-pointer animate-up-down"
                  style={{ animationDelay: `${index * 0.3}s` }}
                  onClick={() => onSelectUnit(v)}
                >
                  <div className="h-48 overflow-hidden bg-white/[0.02] relative">
                    {v.image_url && (
                      <img src={v.image_url} alt={v.name} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 right-4 bg-primary text-white text-[8px] font-black px-2 py-1 uppercase tracking-widest rounded-sm shadow-lg">Available</div>
                  </div>
                  <div className="p-6 bg-black">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors mb-4">{v.name}</h4>
                    <div className="flex justify-between items-center mb-6">
                      <p className="text-sm font-black text-white/80"><span className="text-[10px] text-primary mr-1">KSh</span>{formatPrice(v.price_per_day)}</p>
                      <div className="p-2 border border-white/10 rounded-sm hover:bg-white/5"><ArrowRight className="w-4 h-4 text-white/30" /></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showRentalModal && (
        <RentalModal
          isOpen={showRentalModal}
          onClose={() => setShowRentalModal(false)}
          vehicle={vehicle}
        />
      )}
    </div>
  );
};

export default VehicleDetailsOverlay;
