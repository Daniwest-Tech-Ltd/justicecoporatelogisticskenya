import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Search, SlidersHorizontal, Car, Loader2, Calendar, Fuel, Users, Settings, Heart, MessageCircle } from "lucide-react";
import RentalModal from "@/components/rental/RentalModal";

interface LookupItem {
  id: string;
  name: string;
}

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
  engine_cc: number | null;
  brand_id: string | null;
  color_id: string | null;
  fuel_type_id: string | null;
}

type StatusFilter = "all" | "available" | "booked";

const Catalogue = () => {
  const location = useLocation();
  const searchState = location.state as { vehicleType?: string } | null;
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Lookup data for filters
  const [brands, setBrands] = useState<LookupItem[]>([]);
  const [colors, setColors] = useState<LookupItem[]>([]);
  const [fuelTypes, setFuelTypes] = useState<LookupItem[]>([]);

  // Selected filters
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedFuelType, setSelectedFuelType] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Rental modal
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showRentalModal, setShowRentalModal] = useState(false);

  // Generate years from 2010 to current year
  const years = Array.from({ length: new Date().getFullYear() - 2009 }, (_, i) => (new Date().getFullYear() - i).toString());

  useEffect(() => {
    fetchVehicles();
    fetchLookupData();
  }, []);

  const fetchLookupData = async () => {
    const [brandsRes, colorsRes, fuelTypesRes] = await Promise.all([
      supabase.from("brands").select("*").order("name"),
      supabase.from("colors").select("*").order("name"),
      supabase.from("fuel_types").select("*").order("name")
    ]);

    if (brandsRes.data) setBrands(brandsRes.data);
    if (colorsRes.data) setColors(colorsRes.data);
    if (fuelTypesRes.data) setFuelTypes(fuelTypesRes.data);
  };

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setVehicles(data);
    }
    setLoading(false);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = vehicle.price_per_day >= priceRange[0] && vehicle.price_per_day <= priceRange[1];
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    const matchesBrand = !selectedBrand || vehicle.brand_id === selectedBrand;
    const matchesColor = !selectedColor || vehicle.color_id === selectedColor;
    const matchesFuelType = !selectedFuelType || vehicle.fuel_type_id === selectedFuelType;
    const matchesYear = !selectedYear || vehicle.year?.toString() === selectedYear;
    
    return matchesSearch && matchesPrice && matchesStatus && matchesBrand && matchesColor && matchesFuelType && matchesYear;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE").format(price);
  };

  const handleRentClick = (vehicle: Vehicle, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVehicle(vehicle);
    setShowRentalModal(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 100000]);
    setStatusFilter("all");
    setSelectedBrand("");
    setSelectedColor("");
    setSelectedFuelType("");
    setSelectedYear("");
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="section-title mb-4 text-foreground">Rental Catalogue</h1>
          <p className="section-subtitle mx-auto">
            Browse our complete fleet of premium rental vehicles
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all ${
              statusFilter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            All Vehicles
          </button>
          <button
            onClick={() => setStatusFilter("available")}
            className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all ${
              statusFilter === "available"
                ? "bg-green-600 text-white"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            In Stock
          </button>
          <button
            onClick={() => setStatusFilter("booked")}
            className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all border ${
              statusFilter === "booked"
                ? "border-red-500 text-red-500 bg-red-500/10"
                : "border-muted text-muted-foreground hover:border-red-500/50"
            }`}
          >
            Booked
          </button>
        </div>

        {/* Search & Filters Bar */}
        <div className="glass-card p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by make, model, or year..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input pl-10 bg-background"
              />
            </div>
            
            {/* Brand Filter */}
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="glass-input bg-background text-foreground appearance-none cursor-pointer"
              >
                <option value="" className="bg-card text-foreground">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id} className="bg-card text-foreground">{brand.name}</option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="glass-input bg-background text-foreground appearance-none cursor-pointer"
              >
                <option value="" className="bg-card text-foreground">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year} className="bg-card text-foreground">{year}</option>
                ))}
              </select>
            </div>

            {/* Fuel Type Filter */}
            <div className="relative">
              <select
                value={selectedFuelType}
                onChange={(e) => setSelectedFuelType(e.target.value)}
                className="glass-input bg-background text-foreground appearance-none cursor-pointer"
              >
                <option value="" className="bg-card text-foreground">All Fuel Types</option>
                {fuelTypes.map((fuel) => (
                  <option key={fuel.id} value={fuel.id} className="bg-card text-foreground">{fuel.name}</option>
                ))}
              </select>
            </div>

            {/* More Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="glass-button flex items-center justify-center gap-2 text-foreground"
            >
              <SlidersHorizontal className="w-5 h-5" />
              More Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Color Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Color</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="glass-input bg-background text-foreground"
                >
                  <option value="" className="bg-card text-foreground">All Colors</option>
                  {colors.map((color) => (
                    <option key={color.id} value={color.id} className="bg-card text-foreground">{color.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Min Price (KSh/Day)</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="glass-input bg-background"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Max Price (KSh/Day)</label>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="glass-input bg-background"
                />
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="glass-button w-full text-foreground"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <p className="text-muted-foreground mb-6">
          Showing {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? "s" : ""}
        </p>

        {/* Vehicle Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="glass-card overflow-hidden group relative">
                {/* Image Container */}
                <Link to={`/vehicle/${vehicle.id}`} className="block">
                  <div className="h-56 bg-muted relative overflow-hidden">
                    {vehicle.image_url ? (
                      <img 
                        src={vehicle.image_url} 
                        alt={vehicle.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <span className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                      vehicle.status === "available" 
                        ? "bg-green-500 text-white" 
                        : "bg-red-500 text-white"
                    }`}>
                      {vehicle.status === "available" ? "✓ IN STOCK" : "BOOKED"}
                    </span>

                    {/* Year Badge */}
                    {vehicle.year && (
                      <span className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold bg-primary text-white">
                        {vehicle.year}
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button className="absolute bottom-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background transition-colors">
                      <Heart className="w-5 h-5 text-muted-foreground hover:text-primary" />
                    </button>
                  </div>
                </Link>

                {/* Vehicle Info */}
                <div className="p-5">
                  <Link to={`/vehicle/${vehicle.id}`}>
                    <h3 className="font-heading font-bold text-lg uppercase mb-1 hover:text-primary transition-colors">
                      {vehicle.name}
                    </h3>
                  </Link>
                  
                  {/* Specs Row */}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {vehicle.seats}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Settings className="w-4 h-4" />
                      {vehicle.transmission}
                    </span>
                  </div>

                  {/* Fuel & Engine */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Fuel className="w-4 h-4" />
                    <span>{vehicle.fuel_type}</span>
                    {vehicle.engine_cc && (
                      <>
                        <span>•</span>
                        <span>{vehicle.engine_cc}CC</span>
                      </>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-primary font-bold text-2xl">
                      KSh {formatPrice(vehicle.price_per_day)}
                      <span className="text-sm font-normal text-muted-foreground">/day</span>
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link 
                      to={`/vehicle/${vehicle.id}`}
                      className="flex-1 glass-button py-2.5 text-center text-sm font-medium"
                    >
                      View Details
                    </Link>
                    {vehicle.status === "available" ? (
                      <button 
                        onClick={(e) => handleRentClick(vehicle, e)}
                        className="flex-1 btn-primary-gradient py-2.5 text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Rent Now
                      </button>
                    ) : (
                      <a
                        href="https://wa.me/254702575512"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 glass-button py-2.5 text-center text-sm font-medium text-green-500 hover:bg-green-500/10"
                      >
                        <MessageCircle className="w-4 h-4 inline mr-1" />
                        Inquire
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <Car className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-xl font-medium mb-2 text-foreground">No vehicles found</p>
            <p className="text-muted-foreground">
              {vehicles.length === 0 
                ? "No vehicles have been added yet. Check back soon!" 
                : "Try adjusting your filters or search query"}
            </p>
          </div>
        )}
      </div>

      {/* Rental Modal */}
      {selectedVehicle && (
        <RentalModal
          isOpen={showRentalModal}
          onClose={() => {
            setShowRentalModal(false);
            setSelectedVehicle(null);
          }}
          vehicle={selectedVehicle}
        />
      )}
    </Layout>
  );
};

export default Catalogue;
