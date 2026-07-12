import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Zap,
  Car,
  User,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  Loader2,
  ShieldCheck,
  Send,
  X,
  CheckCircle2,
  AlertTriangle,
  Upload,
  PlusCircle,
  Users
} from "lucide-react";
import { format, differenceInSeconds } from "date-fns";

interface Driver {
  id: string;
  driver_name: string;
  driver_id_jck: string;
  email: string;
  status: string;
}

interface Vehicle {
  id: string;
  name: string;
  fleet_number: string;
  status: string;
}

interface Assignment {
  id: string;
  work_type: string;
  location: string;
  amount_to_be_paid: number;
  duration_time: string;
  status: string;
  assigned_at: string;
  ends_at: string | null;
  drivers: {
    driver_name: string;
    driver_id_jck: string;
  };
  vehicles: {
    name: string;
    fleet_number: string;
  };
}

const WORK_TYPES = [
  "Corporate Shuttle",
  "VIP Transport",
  "Cargo Delivery",
  "Site Inspection",
  "Event Logistics",
  "Airport Transfer",
  "Long-term Lease Support"
];

const CountdownTimer = ({ endsAt }: { endsAt: string | null }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!endsAt) return;

    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(endsAt);
      const seconds = differenceInSeconds(end, now);

      if (seconds <= 0) {
        setTimeLeft("EXPIRED");
        clearInterval(timer);
      } else {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endsAt]);

  if (!endsAt) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-sm">
      <Clock className="w-3 h-3 text-primary animate-pulse" />
      <span className="text-[10px] font-mono font-black text-primary">{timeLeft}</span>
    </div>
  );
};

const MissionDispatch = () => {
  const { toast } = useToast();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [useNewDriver, setUseNewDriver] = useState(false);
  const [uploadingDocs, setUploadingDocs] = useState({ id: false, dl: false });

  const [formData, setFormData] = useState({
    driver_id: "",
    vehicle_id: "",
    work_type: "",
    work_description: "",
    location: "",
    amount_to_be_paid: 0,
    duration_time: "",
    duration_hours: 24, // Default 24 hours for countdown
    // New driver fields
    new_driver_name: "",
    new_driver_email: "",
    new_driver_phone: "",
    new_driver_id_url: "",
    new_driver_dl_url: ""
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    const [driversRes, vehiclesRes, assignmentsRes] = await Promise.all([
      supabase.from("drivers").select("*").eq("status", "available"),
      supabase.from("vehicles").select("*").eq("status", "available"),
      supabase.from("assignments").select(`
        *,
        drivers (driver_name, driver_id_jck),
        vehicles (name, fleet_number)
      `).order("assigned_at", { ascending: false })
    ]);

    if (driversRes.data) setDrivers(driversRes.data);
    if (vehiclesRes.data) setVehicles(vehiclesRes.data);
    if (assignmentsRes.data) setAssignments(assignmentsRes.data as any);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'dl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDocs(prev => ({ ...prev, [type]: true }));
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${type}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('driver-docs')
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Upload Failed", description: "Storage sync failed", variant: "destructive" });
    } else {
      const { data: { publicUrl } } = supabase.storage.from('driver-docs').getPublicUrl(fileName);
      setFormData(prev => ({
        ...prev,
        [type === 'id' ? 'new_driver_id_url' : 'new_driver_dl_url']: publicUrl
      }));
      toast({ title: "Document Synced", description: "Verification data stored" });
    }
    setUploadingDocs(prev => ({ ...prev, [type]: false }));
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalDriverId = formData.driver_id;

      // Logic for New Driver Entry
      if (useNewDriver) {
        const driverIdJck = `${formData.new_driver_name.split(' ')[0]}-DR${Math.floor(Math.random() * 100).toString().padStart(2, '0')}/JCK`;
        const { data: newDriver, error: driverError } = await supabase
          .from("drivers")
          .insert([{
            driver_name: formData.new_driver_name,
            email: formData.new_driver_email,
            phone_number: formData.new_driver_phone,
            id_card_url: formData.new_driver_id_url,
            dl_copy_url: formData.new_driver_dl_url,
            driver_id_jck: driverIdJck,
            status: 'assigned'
          }])
          .select()
          .single();

        if (driverError) throw driverError;
        finalDriverId = newDriver.id;
      }

      const endsAt = new Date(Date.now() + formData.duration_hours * 60 * 60 * 1000).toISOString();

      const { data: assignmentData, error } = await supabase
        .from("assignments")
        .insert([{
          vehicle_id: formData.vehicle_id,
          driver_id: finalDriverId,
          work_type: formData.work_type,
          work_description: formData.work_description,
          location: formData.location,
          amount_to_be_paid: formData.amount_to_be_paid,
          duration_time: formData.duration_time,
          ends_at: endsAt,
          status: 'active'
        }])
        .select(`
          *,
          drivers (driver_name, email, driver_id_jck),
          vehicles (name, fleet_number)
        `)
        .single();

      if (error) throw error;

      toast({ title: "Mission Active", description: "Deployment transmission complete" });

      // Trigger Email
      await supabase.functions.invoke("send-notification", {
        body: {
          to: assignmentData.drivers.email,
          subject: `JCK Mission Dispatch: Fleet ${assignmentData.vehicles.fleet_number}`,
          type: "driver_assignment",
          data: {
            driverName: assignmentData.drivers.driver_name,
            fleetNumber: assignmentData.vehicles.fleet_number,
            workType: assignmentData.work_type,
            description: assignmentData.work_description,
            location: assignmentData.location,
            duration: assignmentData.duration_time,
            amount: assignmentData.amount_to_be_paid.toLocaleString()
          }
        }
      });

      fetchInitialData();
      closeModal();
    } catch (err: any) {
      toast({ title: "Dispatch Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowDispatchModal(false);
    setUseNewDriver(false);
    setFormData({
      driver_id: "",
      vehicle_id: "",
      work_type: "",
      work_description: "",
      location: "",
      amount_to_be_paid: 0,
      duration_time: "",
      duration_hours: 24,
      new_driver_name: "",
      new_driver_email: "",
      new_driver_phone: "",
      new_driver_id_url: "",
      new_driver_dl_url: ""
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Synchronizing Mission Control...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-sm">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Mission Dispatch Hub</h2>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Active Logistical Assignment Interface</p>
          </div>
        </div>
        <button
          onClick={() => setShowDispatchModal(true)}
          className="btn-scan flex items-center gap-3"
        >
          <Send className="w-4 h-4" />
          Execute New Mission
        </button>
      </div>

      {/* Active Missions Registry */}
      <div className="space-y-4">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-2">Active Mission Registry</span>
        {assignments.length === 0 ? (
          <div className="p-16 border border-dashed border-white/10 rounded-sm text-center">
            <ShieldCheck className="w-12 h-12 text-white/10 mx-auto mb-6" />
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30">No Active Missions in Progress</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="p-6 bg-black border border-white/5 rounded-sm hover:border-primary/30 transition-all group">
                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                   <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-primary" />
                      <p className="text-[11px] font-black uppercase text-white">{assignment.drivers.driver_name}</p>
                      <span className="text-[8px] font-mono text-white/30 tracking-tighter">[{assignment.drivers.driver_id_jck}]</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Car className="w-4 h-4 text-white/20" />
                      <p className="text-[10px] font-black uppercase text-white/60">{assignment.vehicles.fleet_number}</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <Zap className="w-3.5 h-3.5 text-yellow-500" />
                      <p className="text-[10px] font-black uppercase text-white/80">{assignment.work_type}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-3.5 h-3.5 text-white/20" />
                      <p className="text-[9px] font-bold uppercase text-white/40">{assignment.location}</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] font-black text-primary">KSh {assignment.amount_to_be_paid.toLocaleString()}</p>
                      <div className="flex items-center gap-2 text-[8px] font-mono text-white/20 uppercase">
                        <Clock className="w-3 h-3" />
                        {assignment.duration_time}
                      </div>
                    </div>
                    {assignment.status === 'active' && <CountdownTimer endsAt={assignment.ends_at} />}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 border rounded-sm text-[8px] font-black uppercase tracking-widest ${
                      assignment.status === 'active' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'
                    }`}>
                      {assignment.status}
                    </span>
                    <button className="p-2.5 border border-white/10 bg-white/5 hover:bg-white/10 transition-all rounded-sm text-white/40 hover:text-white">
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mission Execution Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-[#050505] border border-white/10 rounded-sm w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-4">
                <Send className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-black uppercase tracking-widest text-white">Execute Mission Parameters</h3>
              </div>
              <button onClick={closeModal} className="p-2 text-white/30 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatch} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {/* Personnel Hub */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">01 // Personnel Selection</span>
                    <div className="h-[1px] w-24 bg-white/5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setUseNewDriver(!useNewDriver)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-sm transition-all text-[9px] font-black uppercase tracking-widest ${
                      useNewDriver ? "bg-primary text-white border-primary" : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                    }`}
                  >
                    {useNewDriver ? <Users className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
                    {useNewDriver ? "Using New Personnel" : "Deploy New Driver"}
                  </button>
                </div>

                {!useNewDriver ? (
                  <select
                    required
                    value={formData.driver_id}
                    onChange={(e) => setFormData({...formData, driver_id: e.target.value})}
                    className="audit-input w-full h-14 bg-white/[0.03] border border-white/10 rounded-sm outline-none px-6 text-white uppercase"
                  >
                    <option value="" className="bg-black">SELECT AVAILABLE DRIVER</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id} className="bg-black">{d.driver_name} [{d.driver_id_jck}]</option>
                    ))}
                  </select>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-primary/20 bg-primary/5 rounded-sm animate-fade-in">
                    <div className="space-y-2">
                      <label className="text-[8px] font-black text-white/40 uppercase">Personnel Name</label>
                      <input required value={formData.new_driver_name} onChange={(e) => setFormData({...formData, new_driver_name: e.target.value})} className="audit-input w-full h-10 bg-black/40 border border-white/10 px-4 text-[10px] text-white uppercase" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] font-black text-white/40 uppercase">Email Node</label>
                      <input required type="email" value={formData.new_driver_email} onChange={(e) => setFormData({...formData, new_driver_email: e.target.value})} className="audit-input w-full h-10 bg-black/40 border border-white/10 px-4 text-[10px] text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] font-black text-white/40 uppercase">Phone Line</label>
                      <input required value={formData.new_driver_phone} onChange={(e) => setFormData({...formData, new_driver_phone: e.target.value})} className="audit-input w-full h-10 bg-black/40 border border-white/10 px-4 text-[10px] text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="relative flex flex-col items-center justify-center h-10 border border-dashed border-white/20 hover:border-primary/40 cursor-pointer transition-all">
                        {uploadingDocs.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" /> : <Upload className="w-3.5 h-3.5 text-white/20" />}
                        <span className="text-[7px] font-black text-white/20 uppercase mt-1">{formData.new_driver_id_url ? "ID LOADED" : "UPLOAD ID"}</span>
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'id')} />
                      </label>
                      <label className="relative flex flex-col items-center justify-center h-10 border border-dashed border-white/20 hover:border-primary/40 cursor-pointer transition-all">
                        {uploadingDocs.dl ? <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" /> : <Upload className="w-3.5 h-3.5 text-white/20" />}
                        <span className="text-[7px] font-black text-white/20 uppercase mt-1">{formData.new_driver_dl_url ? "DL LOADED" : "UPLOAD DL"}</span>
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'dl')} />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Asset Selection */}
              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">02 // Strategic Unit Selection</label>
                <select
                  required
                  value={formData.vehicle_id}
                  onChange={(e) => setFormData({...formData, vehicle_id: e.target.value})}
                  className="audit-input w-full h-14 bg-white/[0.03] border border-white/10 rounded-sm outline-none px-6 text-white uppercase"
                >
                  <option value="" className="bg-black">SELECT AVAILABLE ASSET</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id} className="bg-black">{v.fleet_number} - {v.name}</option>
                  ))}
                </select>
              </div>

              {/* Mission Parameters */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">03 // Mission Logistics</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Work Classification</label>
                    <select
                      required
                      value={formData.work_type}
                      onChange={(e) => setFormData({...formData, work_type: e.target.value})}
                      className="audit-input w-full h-12 bg-white/[0.03] border border-white/10 rounded-sm outline-none px-4 uppercase"
                    >
                      <option value="" className="bg-black">SELECT TYPE</option>
                      {WORK_TYPES.map(type => (
                        <option key={type} value={type} className="bg-black">{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Target Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <input required type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="audit-input w-full h-12 bg-white/[0.03] border border-white/10 rounded-sm outline-none pl-12 text-white uppercase" placeholder="MISSION DESTINATION" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Financial Valuation (KSh)</label>
                    <input required type="number" value={formData.amount_to_be_paid} onChange={(e) => setFormData({...formData, amount_to_be_paid: Number(e.target.value)})} className="audit-input w-full h-12 bg-white/[0.03] border border-white/10 rounded-sm px-6 text-white uppercase" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Temporal Allocation (Label)</label>
                    <input required type="text" value={formData.duration_time} onChange={(e) => setFormData({...formData, duration_time: e.target.value})} className="audit-input w-full h-12 bg-white/[0.03] border border-white/10 rounded-sm px-6 text-white uppercase" placeholder="E.G. 3 DAYS" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Countdown Duration (Hours)</label>
                    <input required type="number" value={formData.duration_hours} onChange={(e) => setFormData({...formData, duration_hours: Number(e.target.value)})} className="audit-input w-full h-12 bg-primary/5 border border-primary/20 rounded-sm px-6 text-primary font-bold uppercase" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Mission Scope (Detailed Description)</label>
                  <textarea rows={4} value={formData.work_description} onChange={(e) => setFormData({...formData, work_description: e.target.value})} className="audit-input w-full bg-white/[0.03] border border-white/10 rounded-sm p-6 text-white uppercase resize-none placeholder:text-white/5" placeholder="ENTER MISSION-CRITICAL OPERATIONAL DETAILS..." />
                </div>
              </div>

              <div className="flex gap-4 pt-10 sticky bottom-0 bg-[#050505] py-4">
                <button type="button" onClick={closeModal} className="flex-1 btn-outline-terminal h-16 uppercase tracking-[0.4em]">Abort Dispatch</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 btn-scan h-16 uppercase tracking-[0.4em] flex items-center justify-center gap-3">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  Confirm & Transmit Mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionDispatch;
