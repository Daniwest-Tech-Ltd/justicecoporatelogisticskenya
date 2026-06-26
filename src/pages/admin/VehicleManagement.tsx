import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Upload,
  Car,
  Loader2,
  Star,
  Image as ImageIcon,
  Activity,
  ShieldCheck,
  Zap
} from "lucide-react";

interface LookupItem {
  id: string;
  name: string;
}

interface VehicleImage {
  id: string;
  vehicle_id: string;
  image_url: string;
  display_order: number;
}

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
  is_featured: boolean;
  brand_id: string | null;
  model: string | null;
  vehicle_type_id: string | null;
  fuel_type_id: string | null;
  transmission_id: string | null;
  color_id: string | null;
  body_type_id: string | null;
  drive_type_id: string | null;
  rental_type_id: string | null;
  condition_id: string | null;
  engine_cc: number | null;
  year: number | null;
}

const ENGINE_CC_OPTIONS = [
  "1000", "1200", "1300", "1500", "1800", "2000", "2200", "2400", 
  "2500", "2700", "2800", "3000", "3500", "4000", "4600", "5000"
];

const STATUS_OPTIONS = [
  "Available", "Booked", "Under Maintenance", "Sold", "Reserved"
];

const VehicleManagement = () => {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingMultiple, setUploadingMultiple] = useState(false);

  // Lookup data
  const [brands, setBrands] = useState<LookupItem[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<LookupItem[]>([]);
  const [fuelTypes, setFuelTypes] = useState<LookupItem[]>([]);
  const [transmissions, setTransmissions] = useState<LookupItem[]>([]);
  const [colors, setColors] = useState<LookupItem[]>([]);
  const [bodyTypes, setBodyTypes] = useState<LookupItem[]>([]);
  const [driveTypes, setDriveTypes] = useState<LookupItem[]>([]);
  const [rentalTypes, setRentalTypes] = useState<LookupItem[]>([]);
  const [conditions, setConditions] = useState<LookupItem[]>([]);

  // Multiple images
  const [vehicleImages, setVehicleImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<VehicleImage[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    model: "",
    category: "",
    price_per_day: 0,
    price_per_week: 0,
    price_per_month: 0,
    driver_fee: 0,
    image_url: "",
    description: "",
    features: "",
    seats: 5,
    status: "Available",
    brand_id: "",
    vehicle_type_id: "",
    fuel_type_id: "",
    transmission_id: "",
    color_id: "",
    body_type_id: "",
    drive_type_id: "",
    rental_type_id: "",
    condition_id: "",
    engine_cc: "",
    year: new Date().getFullYear(),
    base_rental_fee: 0
  });

  const handleBaseFeeChange = (fee: number) => {
    const vatRate = 0.16;
    const vatAmount = fee * vatRate;
    const dailyTotal = fee + vatAmount;

    setFormData({
      ...formData,
      base_rental_fee: fee,
      price_per_day: Math.round(dailyTotal),
      price_per_week: Math.round(dailyTotal * 7),
      price_per_month: Math.round(dailyTotal * 30)
    });
  };

  useEffect(() => {
    fetchVehicles();
    fetchLookupData();
  }, []);

  const fetchLookupData = async () => {
    const [
      brandsRes,
      vehicleTypesRes,
      fuelTypesRes,
      transmissionsRes,
      colorsRes,
      bodyTypesRes,
      driveTypesRes,
      rentalTypesRes,
      conditionsRes
    ] = await Promise.all([
      supabase.from("brands").select("*").order("name"),
      supabase.from("vehicle_types").select("*").order("name"),
      supabase.from("fuel_types").select("*").order("name"),
      supabase.from("transmissions").select("*").order("name"),
      supabase.from("colors").select("*").order("name"),
      supabase.from("body_types").select("*").order("name"),
      supabase.from("drive_types").select("*").order("name"),
      supabase.from("rental_types").select("*").order("name"),
      supabase.from("conditions").select("*").order("name")
    ]);

    if (brandsRes.data) setBrands(brandsRes.data);
    if (vehicleTypesRes.data) setVehicleTypes(vehicleTypesRes.data);
    if (fuelTypesRes.data) setFuelTypes(fuelTypesRes.data);
    if (transmissionsRes.data) setTransmissions(transmissionsRes.data);
    if (colorsRes.data) setColors(colorsRes.data);
    if (bodyTypesRes.data) setBodyTypes(bodyTypesRes.data);
    if (driveTypesRes.data) setDriveTypes(driveTypesRes.data);
    if (rentalTypesRes.data) setRentalTypes(rentalTypesRes.data);
    if (conditionsRes.data) setConditions(conditionsRes.data);
  };

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch vehicles", variant: "destructive" });
    } else {
      setVehicles(data || []);
    }
    setLoading(false);
  };

  const fetchVehicleImages = async (vehicleId: string) => {
    const { data } = await supabase
      .from("vehicle_images")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .order("display_order");
    
    if (data) {
      setExistingImages(data);
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("vehicle-images")
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("vehicle-images")
      .getPublicUrl(fileName);

    setFormData({ ...formData, image_url: publicUrl });
    setUploading(false);
    toast({ title: "Success", description: "Image uploaded successfully" });
  };

  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentTotal = vehicleImages.length + existingImages.length;
    const availableSlots = 8 - currentTotal;

    if (files.length > availableSlots) {
      toast({ 
        title: "Limit Reached", 
        description: `You can only add ${availableSlots} more images (max 8 total)`, 
        variant: "destructive" 
      });
      return;
    }

    setUploadingMultiple(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${i}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("vehicle-images")
        .upload(fileName, file);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from("vehicle-images")
          .getPublicUrl(fileName);
        newUrls.push(publicUrl);
      }
    }

    setVehicleImages([...vehicleImages, ...newUrls]);
    setUploadingMultiple(false);
    toast({ title: "Success", description: `${newUrls.length} images uploaded` });
  };

  const removeImage = (index: number) => {
    setVehicleImages(vehicleImages.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId: string) => {
    await supabase.from("vehicle_images").delete().eq("id", imageId);
    setExistingImages(existingImages.filter(img => img.id !== imageId));
    toast({ title: "Image removed" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const vehicleData = {
      name: formData.name || `${brands.find(b => b.id === formData.brand_id)?.name || ''} ${formData.model}`.trim(),
      model: formData.model || null,
      category: vehicleTypes.find(v => v.id === formData.vehicle_type_id)?.name || formData.category || "SUV",
      price_per_day: formData.price_per_day,
      price_per_week: formData.price_per_week || null,
      price_per_month: formData.price_per_month || null,
      driver_fee: formData.driver_fee || null,
      image_url: formData.image_url || vehicleImages[0] || null,
      description: formData.description || null,
      features: formData.features ? formData.features.split(",").map(f => f.trim()) : null,
      seats: formData.seats,
      fuel_type: fuelTypes.find(f => f.id === formData.fuel_type_id)?.name || "Petrol",
      transmission: transmissions.find(t => t.id === formData.transmission_id)?.name || "Automatic",
      status: formData.status.toLowerCase(),
      brand_id: formData.brand_id || null,
      vehicle_type_id: formData.vehicle_type_id || null,
      fuel_type_id: formData.fuel_type_id || null,
      transmission_id: formData.transmission_id || null,
      color_id: formData.color_id || null,
      body_type_id: formData.body_type_id || null,
      drive_type_id: formData.drive_type_id || null,
      rental_type_id: formData.rental_type_id || null,
      condition_id: formData.condition_id || null,
      engine_cc: formData.engine_cc ? parseInt(formData.engine_cc) : null,
      year: formData.year || null
    };

    if (editingVehicle) {
      const { error } = await supabase
        .from("vehicles")
        .update(vehicleData)
        .eq("id", editingVehicle.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update vehicle", variant: "destructive" });
        return;
      }

      // Add new images
      if (vehicleImages.length > 0) {
        const imageInserts = vehicleImages.map((url, index) => ({
          vehicle_id: editingVehicle.id,
          image_url: url,
          display_order: existingImages.length + index
        }));
        await supabase.from("vehicle_images").insert(imageInserts);
      }

      toast({ title: "Success", description: "Vehicle updated successfully" });
      fetchVehicles();
      closeModal();
    } else {
      const { data, error } = await supabase
        .from("vehicles")
        .insert([vehicleData])
        .select()
        .single();

      if (error) {
        toast({ title: "Error", description: "Failed to add vehicle", variant: "destructive" });
        return;
      }

      // Add images
      if (vehicleImages.length > 0 && data) {
        const imageInserts = vehicleImages.map((url, index) => ({
          vehicle_id: data.id,
          image_url: url,
          display_order: index
        }));
        await supabase.from("vehicle_images").insert(imageInserts);
      }

      toast({ title: "Success", description: "Vehicle added successfully" });
      fetchVehicles();
      closeModal();
    }
  };

  const handleEdit = async (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    await fetchVehicleImages(vehicle.id);
    const baseFee = Math.round(vehicle.price_per_day / 1.16);
    setFormData({
      name: vehicle.name,
      model: vehicle.model || "",
      category: vehicle.category,
      price_per_day: vehicle.price_per_day,
      price_per_week: vehicle.price_per_week || 0,
      price_per_month: vehicle.price_per_month || 0,
      driver_fee: vehicle.driver_fee || 0,
      image_url: vehicle.image_url || "",
      description: vehicle.description || "",
      features: vehicle.features?.join(", ") || "",
      seats: vehicle.seats,
      status: vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1),
      brand_id: vehicle.brand_id || "",
      vehicle_type_id: vehicle.vehicle_type_id || "",
      fuel_type_id: vehicle.fuel_type_id || "",
      transmission_id: vehicle.transmission_id || "",
      color_id: vehicle.color_id || "",
      body_type_id: vehicle.body_type_id || "",
      drive_type_id: vehicle.drive_type_id || "",
      rental_type_id: vehicle.rental_type_id || "",
      condition_id: vehicle.condition_id || "",
      engine_cc: vehicle.engine_cc?.toString() || "",
      year: vehicle.year || new Date().getFullYear(),
      base_rental_fee: baseFee
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    const { error } = await supabase
      .from("vehicles")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete vehicle", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Vehicle deleted successfully" });
      fetchVehicles();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVehicle(null);
    setVehicleImages([]);
    setExistingImages([]);
    setFormData({
      name: "",
      model: "",
      category: "",
      price_per_day: 0,
      price_per_week: 0,
      price_per_month: 0,
      driver_fee: 0,
      image_url: "",
      description: "",
      features: "",
      seats: 5,
      status: "Available",
      brand_id: "",
      vehicle_type_id: "",
      fuel_type_id: "",
      transmission_id: "",
      color_id: "",
      body_type_id: "",
      drive_type_id: "",
      rental_type_id: "",
      condition_id: "",
      engine_cc: "",
      year: new Date().getFullYear(),
      base_rental_fee: 0
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Syncing Asset Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-sm">
            <Car className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Asset Deployment Management</h2>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Global Fleet Registry Controls</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-scan flex items-center gap-3"
        >
          <Plus className="w-4 h-4" />
          Initialize New Unit
        </button>
      </div>

      {/* Vehicles Tactical Grid */}
      {vehicles.length === 0 ? (
        <div className="p-16 border border-dashed border-white/10 rounded-sm text-center">
          <Car className="w-12 h-12 text-white/10 mx-auto mb-6" />
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 mb-8">No Tactical Units Registered</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-outline-terminal px-10"
          >
            Deploy First Asset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="unit-card group">
              <div className="h-52 bg-white/[0.02] relative overflow-hidden">
                {vehicle.image_url ? (
                  <img 
                    src={vehicle.image_url} 
                    alt={vehicle.name}
                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10 uppercase font-black text-[10px]">Visual N/A</div>
                )}

                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded-sm shadow-xl ${
                    vehicle.status === "available" ? "bg-primary text-white" : "bg-red-900/80 text-white"
                  }`}>
                    {vehicle.status}
                  </span>
                </div>

                {vehicle.is_featured && (
                  <div className="absolute top-4 left-4">
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/10 text-yellow-500 text-[8px] font-black uppercase tracking-widest border border-yellow-500/20 rounded-sm">
                      <Star className="w-3 h-3 fill-current" /> High Priority
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 bg-black">
                <h3 className="text-sm font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors mb-2 truncate">{vehicle.name}</h3>
                <div className="flex justify-between items-baseline mb-6 pb-4 border-b border-white/5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">{vehicle.category} Unit</span>
                  <p className="text-lg font-black text-white"><span className="text-[10px] text-primary mr-1">KSh</span>{vehicle.price_per_day.toLocaleString()}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      await supabase.from("vehicles").update({ is_featured: !vehicle.is_featured }).eq("id", vehicle.id);
                      fetchVehicles();
                    }}
                    className={`p-3 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all rounded-sm ${vehicle.is_featured ? "text-yellow-500 border-yellow-500/20 bg-yellow-500/5" : "text-white/20"}`}
                  >
                    <Star className={`w-4 h-4 ${vehicle.is_featured ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="flex-1 btn-outline-terminal h-12 flex items-center justify-center gap-3"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Modify
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className="p-3 border border-red-500/10 bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deployment Modal Interface */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-black border border-white/10 rounded-sm w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-4">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-black uppercase tracking-widest text-white">
                  {editingVehicle ? "Update Unit Configuration" : "Initialize Asset Registry"}
                </h3>
              </div>
              <button onClick={closeModal} className="p-2 text-white/30 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10">
              {/* Technical Visual Config */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-1">Primary Asset Visualization</label>
                  <div className="flex items-center gap-6 p-4 border border-white/5 bg-white/[0.02] rounded-sm">
                    {formData.image_url ? (
                      <div className="w-32 h-32 rounded-sm overflow-hidden border border-white/10">
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-32 h-32 flex items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-sm">
                        <ImageIcon className="w-8 h-8 text-white/10" />
                      </div>
                    )}
                    <label className="btn-outline-terminal h-14 flex items-center gap-3 px-6 cursor-pointer">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span className="text-[10px]">{uploading ? "TRANSMITTING..." : "UPLOAD MASTER VISUAL"}</span>
                      <input type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-1">Asset Multi-Angle Registry (MAX 8)</label>
                  <div className="flex flex-wrap gap-2">
                    {existingImages.map((img) => (
                      <div key={img.id} className="relative group w-16 h-16 border border-white/10 rounded-sm overflow-hidden">
                        <img src={img.image_url} alt="Asset" className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                        <button type="button" onClick={() => removeExistingImage(img.id)} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                    {vehicleImages.map((url, index) => (
                      <div key={index} className="relative group w-16 h-16 border border-primary/20 rounded-sm overflow-hidden">
                        <img src={url} alt="New Visual" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                    {(vehicleImages.length + existingImages.length) < 8 && (
                      <label className="w-16 h-16 border-2 border-dashed border-white/5 rounded-sm flex items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-white/[0.02] transition-all">
                        {uploadingMultiple ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Plus className="w-4 h-4 text-white/20" />}
                        <input type="file" accept="image/*" multiple onChange={handleMultipleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Core Unit Specs */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">01 // Identity Modules</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Asset Brand</label>
                    <select value={formData.brand_id} onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })} className="audit-input w-full h-14 bg-white/[0.03] border border-white/10 rounded-sm outline-none px-4 uppercase">
                      <option value="" className="bg-black">SELECT BRAND</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id} className="bg-black">{brand.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Unit Model</label>
                    <input type="text" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="audit-input w-full h-14 bg-white/[0.03] border border-white/10 rounded-sm outline-none px-6 text-white uppercase" placeholder="MODEL DESIGNATION" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">System Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="audit-input w-full h-14 bg-white/[0.03] border border-white/10 rounded-sm outline-none px-6 text-white uppercase" placeholder="OVERRIDE SYSTEM NAME" />
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">02 // Technical Specs</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Category</label>
                    <select value={formData.vehicle_type_id} onChange={(e) => setFormData({ ...formData, vehicle_type_id: e.target.value })} className="audit-input w-full h-12 bg-white/[0.03] border border-white/10 rounded-sm outline-none px-4 uppercase">
                      <option value="" className="bg-black">SELECT TYPE</option>
                      {vehicleTypes.map((type) => (
                        <option key={type.id} value={type.id} className="bg-black">{type.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Transmission</label>
                    <select value={formData.transmission_id} onChange={(e) => setFormData({ ...formData, transmission_id: e.target.value })} className="audit-input w-full h-12 bg-white/[0.03] border border-white/10 rounded-sm outline-none px-4 uppercase">
                      <option value="" className="bg-black">SELECT SYSTEM</option>
                      {transmissions.map((t) => (
                        <option key={t.id} value={t.id} className="bg-black">{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Energy Cell</label>
                    <select value={formData.fuel_type_id} onChange={(e) => setFormData({ ...formData, fuel_type_id: e.target.value })} className="audit-input w-full h-12 bg-white/[0.03] border border-white/10 rounded-sm outline-none px-4 uppercase">
                      <option value="" className="bg-black">SELECT FUEL</option>
                      {fuelTypes.map((f) => (
                        <option key={f.id} value={f.id} className="bg-black">{f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Unit CC</label>
                    <select value={formData.engine_cc} onChange={(e) => setFormData({ ...formData, engine_cc: e.target.value })} className="audit-input w-full h-12 bg-white/[0.03] border border-white/10 rounded-sm outline-none px-4 uppercase">
                      <option value="" className="bg-black">SELECT CC</option>
                      {ENGINE_CC_OPTIONS.map((cc) => (
                        <option key={cc} value={cc} className="bg-black">{cc} CC</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Financial Authentication */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">03 // Financial Protocols</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-primary ml-1">Base Rental Fee (KSh)</label>
                    <input
                      type="number"
                      value={formData.base_rental_fee}
                      onChange={(e) => handleBaseFeeChange(Number(e.target.value))}
                      required
                      className="audit-input w-full h-12 bg-primary/10 border border-primary/30 rounded-sm px-6 text-white uppercase font-bold"
                    />
                    <p className="text-[7px] font-mono text-primary/60 uppercase ml-1">+16% VAT Auto-Calculated</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Daily Rate (Inc. VAT)</label>
                    <input type="number" value={formData.price_per_day} readOnly className="audit-input w-full h-12 bg-white/5 border border-white/10 rounded-sm px-6 text-white/50 uppercase font-mono cursor-not-allowed" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Weekly Sync (7 Days)</label>
                    <input type="number" value={formData.price_per_week} readOnly className="audit-input w-full h-12 bg-white/5 border border-white/10 rounded-sm px-6 text-white/50 uppercase font-mono cursor-not-allowed" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Monthly Cycle (30 Days)</label>
                    <input type="number" value={formData.price_per_month} readOnly className="audit-input w-full h-12 bg-white/5 border border-white/10 rounded-sm px-6 text-white/50 uppercase font-mono cursor-not-allowed" />
                  </div>
                </div>
              </div>

              {/* Status & Availability */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">04 // Operational Status</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Current Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="audit-input w-full h-12 bg-white/[0.03] border border-white/10 rounded-sm outline-none px-4 uppercase">
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status} className="bg-black">{status}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Registry Year</label>
                    <input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })} className="audit-input w-full h-12 bg-white/[0.03] border border-white/10 rounded-sm px-6 text-white uppercase" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Unit Capacity</label>
                    <input type="number" value={formData.seats} onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })} className="audit-input w-full h-12 bg-white/[0.03] border border-white/10 rounded-sm px-6 text-white uppercase" />
                  </div>
                </div>
              </div>

              {/* Tactical Description */}
              <div className="space-y-4 pt-10 border-t border-white/5">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 ml-1">Unit Description & Logistical Overview</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="audit-input w-full bg-white/[0.03] border border-white/10 rounded-sm p-6 text-white uppercase resize-none placeholder:text-white/5" placeholder="ENTER MISSION-CRITICAL UNIT DETAILS..." />
              </div>

              {/* Execution Actions */}
              <div className="flex gap-4 pt-10 sticky bottom-0 bg-black py-4 mt-10">
                <button type="button" onClick={closeModal} className="flex-1 btn-outline-terminal h-16 uppercase tracking-[0.4em]">Abort Initialization</button>
                <button type="submit" className="flex-1 btn-scan h-16 uppercase tracking-[0.4em]">Execute Deployment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
