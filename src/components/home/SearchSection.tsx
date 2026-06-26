import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, MapPin, Calendar, Car } from "lucide-react";

const SearchSection = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: "",
    pickupDate: "",
    returnDate: "",
    vehicleType: "",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/catalogue", { state: searchData });
  };

  return (
    <section className="relative z-20 -mt-12 px-4 mb-24">
      <div className="container mx-auto">
        <form onSubmit={handleSearch} className="audit-bar shadow-2xl p-2 bg-black border border-white/10 rounded-lg flex flex-col lg:flex-row items-stretch lg:items-center gap-2">

          {/* Location Input Interface */}
          <div className="flex-1 w-full relative group">
            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <select
              value={searchData.location}
              onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
              className="w-full h-16 pl-14 bg-transparent text-[11px] font-bold tracking-widest text-white appearance-none focus:outline-none cursor-pointer uppercase"
              title="Select Pickup Location"
              aria-label="Pickup Location"
            >
              <option value="" className="bg-black">Target Location</option>
              <option value="Nairobi CBD" className="bg-black">Nairobi CBD</option>
              <option value="Westlands" className="bg-black">Westlands</option>
              <option value="JKIA Airport" className="bg-black">JKIA Airport</option>
              <option value="Mombasa" className="bg-black">Mombasa</option>
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
          </div>

          {/* Temporal Range Interface (Dates) */}
          <div className="flex-[1.5] w-full grid grid-cols-1 sm:grid-cols-2 border-t lg:border-t-0 lg:border-l border-white/10">
            <div className="relative group p-1 sm:p-0">
              <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <input
                type="date"
                value={searchData.pickupDate}
                onChange={(e) => setSearchData({ ...searchData, pickupDate: e.target.value })}
                className="w-full h-16 pl-14 bg-transparent text-[10px] font-bold tracking-widest text-white focus:outline-none uppercase"
                min={new Date().toISOString().split('T')[0]}
                title="Select Pickup Date"
                aria-label="Pickup Date"
              />
            </div>
            <div className="relative group p-1 sm:p-0 border-t sm:border-t-0 sm:border-l border-white/10">
              <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <input
                type="date"
                value={searchData.returnDate}
                onChange={(e) => setSearchData({ ...searchData, returnDate: e.target.value })}
                className="w-full h-16 pl-14 bg-transparent text-[10px] font-bold tracking-widest text-white focus:outline-none uppercase"
                min={searchData.pickupDate || new Date().toISOString().split('T')[0]}
                title="Select Return Date"
                aria-label="Return Date"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="w-full lg:w-64 relative border-t lg:border-t-0 lg:border-l border-white/10 group">
            <Car className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <select
              value={searchData.vehicleType}
              onChange={(e) => setSearchData({ ...searchData, vehicleType: e.target.value })}
              className="w-full h-16 pl-14 pr-12 bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-white appearance-none cursor-pointer focus:outline-none"
              title="Select Asset Category"
              aria-label="Asset Category"
            >
              <option value="" className="bg-black">Asset Category</option>
              <option value="SUV" className="bg-black">SUV / 4x4</option>
              <option value="Sedan" className="bg-black">Executive Sedan</option>
              <option value="Van" className="bg-black">Logistics Van</option>
              <option value="Luxury" className="bg-black">Luxury Units</option>
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          </div>

          {/* Execute Deployment (Search Button) */}
          <button
            type="submit"
            className="w-full lg:w-auto h-16 px-12 btn-execute bg-[#0047AB] hover:bg-[#003d94] transition-all flex items-center justify-center gap-3 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span className="lg:hidden xl:inline">Execute Search</span>
            <span className="hidden lg:inline xl:hidden">Execute</span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default SearchSection;
