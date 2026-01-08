import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Search, SlidersHorizontal, Car, Loader2 } from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  category: string;
  price_per_day: number;
  image_url: string | null;
  description: string | null;
  features: string[] | null;
  seats: number;
  fuel_type: string;
  transmission: string;
  status: string;
}

const categories = ["All", "SUV", "Sedan", "Hatchback", "Van", "Luxury", "4x4"];

const Catalogue = () => {
  const location = useLocation();
  const searchState = location.state as { vehicleType?: string } | null;
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchState?.vehicleType || "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchVehicles();
  }, []);

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
    const matchesCategory = selectedCategory === "All" || vehicle.category === selectedCategory;
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = vehicle.price_per_day >= priceRange[0] && vehicle.price_per_day <= priceRange[1];
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    
    return matchesCategory && matchesSearch && matchesPrice && matchesStatus;
  });

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
        <div className="text-center mb-12">
          <h1 className="section-title mb-4 text-foreground">Rental Catalogue</h1>
          <p className="section-subtitle mx-auto">
            Browse our complete fleet of premium rental vehicles
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="glass-card p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input pl-10"
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="glass-button flex items-center justify-center gap-2 md:w-auto text-foreground"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Price Range (KSh/Day)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="glass-input"
                  />
                  <span className="text-foreground">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="glass-input"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Availability</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="glass-input"
                >
                  <option value="all">All Vehicles</option>
                  <option value="available">Available Only</option>
                  <option value="booked">Booked</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                    setPriceRange([0, 100000]);
                    setStatusFilter("all");
                  }}
                  className="glass-button w-full text-foreground"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedCategory === category
                  ? "btn-primary-gradient"
                  : "glass-button text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-muted-foreground mb-6">
          Showing {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? "s" : ""}
        </p>

        {/* Vehicle Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="glass-card overflow-hidden group">
                <div className="h-48 bg-muted relative overflow-hidden">
                  {vehicle.image_url ? (
                    <img 
                      src={vehicle.image_url} 
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                  <span className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium ${
                    vehicle.status === "available" ? "bg-green-500/90 text-white" :
                    vehicle.status === "booked" ? "bg-yellow-500/90 text-white" :
                    "bg-red-500/90 text-white"
                  }`}>
                    {vehicle.status === "available" ? "Available" : 
                     vehicle.status === "booked" ? "Booked" : "Maintenance"}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-heading font-bold text-lg">{vehicle.name}</h3>
                      <p className="text-sm text-muted-foreground">{vehicle.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2 py-1 rounded bg-muted">{vehicle.seats} Seats</span>
                    <span className="text-xs px-2 py-1 rounded bg-muted">{vehicle.fuel_type}</span>
                    <span className="text-xs px-2 py-1 rounded bg-muted">{vehicle.transmission}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-primary font-bold text-xl">
                        KSh {vehicle.price_per_day.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground text-sm">/day</span>
                    </div>
                    <a 
                      href="https://wa.me/254722827458"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary-gradient px-4 py-2 text-sm"
                    >
                      Book Now
                    </a>
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
    </Layout>
  );
};

export default Catalogue;
