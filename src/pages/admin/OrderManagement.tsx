import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  Check, 
  X, 
  MessageCircle, 
  Mail, 
  Phone, 
  Calendar,
  Car,
  Loader2,
  Eye,
  FileDown,
  Activity,
  ShieldCheck,
  Zap,
  FileText,
  ArrowDown,
  Save
} from "lucide-react";
import { format } from "date-fns";
import { generateOrdersPDF, generateContractPDF } from "@/utils/pdfGenerator";

interface RentalOrder {
  id: string;
  vehicle_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  preferred_contact: string;
  pickup_date: string;
  return_date: string;
  pickup_location: string | null;
  notes: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  contract_details?: any;
  vehicles?: {
    name: string;
    image_url: string | null;
    price_per_day: number;
  };
}

const OrderManagement = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<RentalOrder | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [isEditingContract, setIsEditingContract] = useState(false);
  const [contractForm, setContractForm] = useState<any>({});
  const [isSavingContract, setIsSavingContract] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const openContractEditor = (order: RentalOrder) => {
    setSelectedOrder(order);
    setContractForm(order.contract_details || {});
    setIsEditingContract(true);
  };

  const saveContractDetails = async () => {
    if (!selectedOrder) return;
    setIsSavingContract(true);

    const { error } = await supabase
      .from("rental_orders")
      .update({ contract_details: contractForm })
      .eq("id", selectedOrder.id);

    if (error) {
      toast({ title: "Sync Failure", description: "Failed to update contract nodes", variant: "destructive" });
    } else {
      toast({ title: "Sync Complete", description: "Contract metadata synchronized successfully" });
      fetchOrders();
    }
    setIsSavingContract(false);
  };

  const handleContractDownload = () => {
    if (!selectedOrder) return;
    const mergedOrder = { ...selectedOrder, contract_details: contractForm };
    generateContractPDF(mergedOrder);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("rental_orders")
      .select(`
        *,
        vehicles (
          name,
          image_url,
          price_per_day
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch orders", variant: "destructive" });
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string, sendEmail: boolean = false) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    setSendingEmail(true);

    const { error } = await supabase
      .from("rental_orders")
      .update({ status, admin_notes: adminNotes || order.admin_notes })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to update order", variant: "destructive" });
      setSendingEmail(false);
      return;
    }

    if (sendEmail) {
      try {
        const statusMessage = status === "approved" 
          ? "Great news! Your rental request has been approved. Please contact us to finalize the booking and arrange pickup."
          : status === "rejected"
          ? "Unfortunately, we are unable to fulfill your rental request at this time. Please contact us for alternatives."
          : `Your booking status has been updated to: ${status}`;

        await supabase.functions.invoke("send-notification", {
          body: {
            to: order.customer_email,
            subject: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)} - Justice Corporate Logistics`,
            type: "booking_update",
            data: {
              customerName: order.customer_name,
              vehicleName: order.vehicles?.name,
              status: status.charAt(0).toUpperCase() + status.slice(1),
              message: statusMessage + (adminNotes ? `\n\nAdmin Notes: ${adminNotes}` : ""),
            },
          },
        });

        toast({ title: "Success", description: `Order ${status} and email sent` });
      } catch (emailError) {
        toast({ title: "Order Updated", description: `Order ${status} but email failed.`, variant: "destructive" });
      }
    } else {
      toast({ title: "Success", description: `Order ${status}` });
    }

    setSendingEmail(false);
    fetchOrders();
    setSelectedOrder(null);
    setAdminNotes("");
  };

  const getContactLink = (order: RentalOrder) => {
    const message = `Hi ${order.customer_name}, regarding your rental request for ${order.vehicles?.name}...`;
    switch (order.preferred_contact) {
      case "whatsapp":
        const phone = order.customer_phone.replace(/[^0-9]/g, "");
        const formattedPhone = phone.startsWith("0") ? `254${phone.slice(1)}` : phone;
        return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
      case "email":
        return `mailto:${order.customer_email}?subject=Your Rental Request&body=${encodeURIComponent(message)}`;
      case "sms":
        return `sms:${order.customer_phone}?body=${encodeURIComponent(message)}`;
      default: return "#";
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      approved: "bg-green-500/10 text-green-500 border-green-500/20",
      rejected: "bg-red-500/10 text-red-500 border-red-500/20",
      completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      cancelled: "bg-white/5 text-white/40 border-white/10",
    };
    return styles[status] || styles.pending;
  };

  const filteredOrders = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const handleExportPDF = () => {
    const pdfData = filteredOrders.map((order) => ({
      id: order.id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      vehicle_name: order.vehicles?.name || "Unknown Vehicle",
      pickup_date: order.pickup_date,
      return_date: order.return_date,
      status: order.status || "pending",
      price_per_day: order.vehicles?.price_per_day || 0,
    }));
    generateOrdersPDF(pdfData, filter);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Syncing Dispatch Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center justify-between pb-6 border-b border-white/10 flex-wrap gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-sm">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Mission Dispatch Terminal</h2>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Active Rental Order Matrix</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportPDF}
            disabled={filteredOrders.length === 0}
            className="btn-outline-terminal h-10 flex items-center gap-2 px-6 disabled:opacity-30"
          >
            <FileDown className="w-4 h-4" />
            <span className="text-[9px]">Generate Audit PDF</span>
          </button>

          <div className="flex p-1 bg-white/[0.03] border border-white/5 rounded-sm gap-1">
            {["all", "pending", "approved", "rejected", "completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all ${
                  filter === status ? "bg-primary text-white" : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                {status}
                {status === "pending" && orders.filter(o => o.status === "pending").length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-sm bg-white text-black">
                    {orders.filter(o => o.status === "pending").length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="p-16 border border-dashed border-white/10 rounded-sm text-center">
          <Package className="w-12 h-12 text-white/10 mx-auto mb-6" />
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30">No Active Missions In Selected Registry</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredOrders.map((order) => (
            <div key={order.id} className="p-6 border border-white/5 bg-black/40 backdrop-blur-md rounded-sm hover:border-primary/30 transition-all group">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                {/* Unit Info */}
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <div className="w-20 h-16 rounded-sm overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                    {order.vehicles?.image_url ? (
                      <img src={order.vehicles.image_url} alt={order.vehicles?.name} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-white/10">N/A</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-white truncate group-hover:text-primary transition-colors">{order.vehicles?.name || "Unidentified Unit"}</h3>
                    <p className="text-[9px] font-mono text-white/30 uppercase mt-1">KSh {order.vehicles?.price_per_day.toLocaleString()} / Cycle</p>
                  </div>
                </div>

                {/* Personnel Info */}
                <div className="flex-1">
                  <p className="text-[11px] font-black uppercase tracking-widest text-white">{order.customer_name}</p>
                  <p className="text-[9px] font-mono text-white/40 uppercase mt-1">{order.customer_email}</p>
                </div>

                {/* Temporal Data */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/60">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>{format(new Date(order.pickup_date), "MMM dd")} - {format(new Date(order.return_date), "MMM dd, yyyy")}</span>
                  </div>
                  <p className="text-[8px] font-mono text-white/20 uppercase mt-2">Initialized: {format(new Date(order.created_at), "yyyy.MM.dd // HH:mm")}</p>
                </div>

                {/* Registry Status & Access */}
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 border rounded-sm text-[8px] font-black uppercase tracking-widest ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>

                  <div className="flex bg-white/5 border border-white/10 rounded-sm overflow-hidden">
                    <button
                      onClick={() => openContractEditor(order)}
                      className="px-3 py-2 border-r border-white/10 hover:bg-primary transition-all text-[8px] font-black uppercase tracking-widest text-white/70 hover:text-white"
                      title="Edit Contract Details"
                    >
                      Edit Agreement
                    </button>
                    <button
                      onClick={() => generateContractPDF(order)}
                      className="px-3 py-2 hover:bg-green-600 transition-all group/dl"
                      title="Direct Download PDF"
                    >
                      <ArrowDown className="w-3 h-3 text-green-500 group-hover/dl:text-white animate-bounce" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setAdminNotes(order.admin_notes || "");
                    }}
                    className="p-2.5 border border-white/10 bg-white/5 hover:bg-primary transition-all rounded-sm group/btn"
                  >
                    <Eye className="w-4 h-4 text-white/40 group-hover/btn:text-white transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contract Editor Terminal */}
      {isEditingContract && selectedOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsEditingContract(false)} />
          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-sm w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black z-20">
              <div className="flex items-center gap-4">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="text-lg font-black uppercase tracking-widest text-white">Legal Agreement Terminal</h3>
                  <p className="text-[9px] font-mono text-white/30 uppercase">Personnel: {selectedOrder.customer_name} // Node: {selectedOrder.id.substring(0,8)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={saveContractDetails}
                  disabled={isSavingContract}
                  className="btn-scan h-10 px-6 flex items-center gap-2 disabled:opacity-30"
                >
                  <Zap className={`w-3.5 h-3.5 ${isSavingContract ? 'animate-spin' : ''}`} />
                  <span className="text-[9px]">Save Agreement</span>
                </button>
                <button
                  onClick={handleContractDownload}
                  className="btn-outline-terminal h-10 px-6 flex items-center gap-2 border-green-500/20 text-green-500 hover:bg-green-600 hover:text-white transition-all"
                >
                  <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                  <span className="text-[9px]">Generate PDF</span>
                </button>
                <button onClick={() => setIsEditingContract(false)} className="p-2 text-white/30 hover:text-white ml-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-12 bg-black custom-scrollbar">
              {/* Document Visual Layout */}
              <div className="max-w-4xl mx-auto space-y-12 bg-white/[0.01] p-12 border border-white/5 shadow-inner">
                <div className="text-center space-y-2 mb-16">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter border-b border-primary/20 pb-4 inline-block">Car Rental Agreement</h2>
                  <p className="text-[10px] font-black text-primary tracking-[0.4em] uppercase">Justice Corporate Logistics Kenya</p>
                </div>

                {/* Grid 1: Basic Telemetry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest block mb-4 border-l-2 border-primary pl-3">01 // Lessee Identification</span>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-white/20 uppercase">Contract Full Name</label>
                        <input value={selectedOrder.customer_name} disabled className="w-full bg-white/5 border-none p-0 text-xs font-black text-white/40 uppercase" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-bold text-white/20 uppercase">ID Card / Passport No.</label>
                        <input
                          type="text"
                          value={contractForm.lessee_id_no || ""}
                          onChange={(e) => setContractForm({...contractForm, lessee_id_no: e.target.value})}
                          className="w-full bg-transparent border-b border-white/10 py-1 text-[11px] text-white focus:border-primary outline-none transition-all uppercase font-mono"
                          placeholder="REQUIRED FIELD"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-bold text-white/20 uppercase">Hires Physical / Residential Address</label>
                        <input
                          type="text"
                          value={contractForm.lessee_physical || ""}
                          onChange={(e) => setContractForm({...contractForm, lessee_physical: e.target.value})}
                          className="w-full bg-transparent border-b border-white/10 py-1 text-[11px] text-white focus:border-primary outline-none transition-all uppercase"
                          placeholder="ENTER ADDRESS"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-bold text-white/20 uppercase">Driving License Number</label>
                        <input
                          type="text"
                          value={contractForm.driver_license_no || ""}
                          onChange={(e) => setContractForm({...contractForm, driver_license_no: e.target.value})}
                          className="w-full bg-transparent border-b border-white/10 py-1 text-[11px] text-white focus:border-primary outline-none transition-all uppercase font-mono"
                          placeholder="DL NUMBER"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest block mb-4 border-l-2 border-primary pl-3">02 // Guarantor Node</span>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[8px] font-bold text-white/20 uppercase">Guarantor Name</label>
                        <input
                          type="text"
                          value={contractForm.guarantor_name || ""}
                          onChange={(e) => setContractForm({...contractForm, guarantor_name: e.target.value})}
                          className="w-full bg-transparent border-b border-white/10 py-1 text-[11px] text-white focus:border-primary outline-none transition-all uppercase"
                          placeholder="FULL NAME"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-bold text-white/20 uppercase">Guarantor ID No.</label>
                        <input
                          type="text"
                          value={contractForm.guarantor_id_no || ""}
                          onChange={(e) => setContractForm({...contractForm, guarantor_id_no: e.target.value})}
                          className="w-full bg-transparent border-b border-white/10 py-1 text-[11px] text-white focus:border-primary outline-none transition-all uppercase font-mono"
                          placeholder="ID NUMBER"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid 2: Owner/Vehicle Details */}
                <div className="space-y-6 pt-12 border-t border-white/5">
                  <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest block mb-6 border-l-2 border-primary pl-3">03 // Owner / Lessor: Asset Specification</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-[8px] font-bold text-white/20 uppercase">Unit Make</label>
                      <input value={selectedOrder.vehicles?.name || "N/A"} disabled className="w-full bg-white/5 border-none p-1 text-[10px] font-black text-white/40 uppercase" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] font-bold text-white/20 uppercase">Car Plate / No.</label>
                      <input
                        type="text"
                        value={contractForm.car_no || ""}
                        onChange={(e) => setContractForm({...contractForm, car_no: e.target.value})}
                        className="w-full bg-transparent border-b border-white/10 py-1 text-[11px] text-white focus:border-primary outline-none transition-all uppercase font-mono"
                        placeholder="KXX XXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] font-bold text-white/20 uppercase">Next Service Mileage</label>
                      <input
                        type="text"
                        value={contractForm.next_service || ""}
                        onChange={(e) => setContractForm({...contractForm, next_service: e.target.value})}
                        className="w-full bg-transparent border-b border-white/10 py-1 text-[11px] text-white focus:border-primary outline-none transition-all uppercase"
                        placeholder="00,000 KM"
                      />
                    </div>
                  </div>
                </div>

                {/* Grid 3: Financials */}
                <div className="space-y-6 pt-12 border-t border-white/5">
                  <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest block mb-6 border-l-2 border-primary pl-3">04 // Financial & Temporal Registry</span>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-2">
                      <label className="text-[8px] font-bold text-white/20 uppercase">M-Pesa Code</label>
                      <input
                        type="text"
                        value={contractForm.mpesa_code || ""}
                        onChange={(e) => setContractForm({...contractForm, mpesa_code: e.target.value})}
                        className="w-full bg-transparent border-b border-white/10 py-1 text-[11px] text-white focus:border-primary outline-none transition-all uppercase font-mono"
                        placeholder="SAXXXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] font-bold text-white/20 uppercase">Security Deposit</label>
                      <input
                        type="number"
                        value={contractForm.deposit_amount || ""}
                        onChange={(e) => setContractForm({...contractForm, deposit_amount: e.target.value})}
                        className="w-full bg-transparent border-b border-white/10 py-1 text-[11px] text-white focus:border-primary outline-none transition-all uppercase font-mono"
                        placeholder="KSH"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] font-bold text-white/20 uppercase">Deployment Cycles</label>
                      <input value={Math.max(1, Math.ceil((new Date(selectedOrder.return_date).getTime() - new Date(selectedOrder.pickup_date).getTime()) / (1000 * 60 * 60 * 24)))} disabled className="w-full bg-transparent border-none p-1 text-[11px] font-black text-white/40 uppercase" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] font-bold text-white/20 uppercase">Total Payable</label>
                      <input value={`KSH ${(selectedOrder.vehicles?.price_per_day * Math.max(1, Math.ceil((new Date(selectedOrder.return_date).getTime() - new Date(selectedOrder.pickup_date).getTime()) / (1000 * 60 * 60 * 24)))).toLocaleString()}`} disabled className="w-full bg-transparent border-none p-1 text-[11px] font-black text-primary uppercase" />
                    </div>
                  </div>
                </div>

                {/* Full Legal Text Simulation */}
                <div className="pt-12 border-t border-white/5 space-y-8">
                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-sm">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60 mb-6 text-center">Standard Operating Conditions</h4>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar text-[10px] font-bold uppercase tracking-widest text-white/30 leading-relaxed">
                      <p>1. VEHICLE HIRE & OWNERSHIP: The Company agrees to let on hire, and the Hirer agrees to take on hire, the motor vehicle described above. The Vehicle remains the sole property of the Company at all times.</p>
                      <p>2. DURATION & RETURN: The hire period shall be as stated in the form. Vehicle must be returned on the agreed date. Unauthorized retention constitutes an offence.</p>
                      <p>3. CONDITION & INSPECTION: The Hirer confirms receipt of the Vehicle in good, roadworthy condition. Any damage will be charged to the Hirer.</p>
                      <p>4. INSURANCE & LIABILITY: The vehicle is insured under Comprehensive cover. The Hirer is liable for damage up to the excess amount (Saloon: 200k, Mid SUV: 300k, SUV/4x4: 500k).</p>
                      <p>5. FUEL POLICY: Vehicle shall be supplied with a full tank and must be returned with a full tank.</p>
                      <p>6. FINES & PENALTIES: The Hirer is responsible for all traffic or parking fines incurred during the period of possession.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-12 pt-8">
                    <div className="border-t border-white/10 pt-4">
                      <span className="text-[8px] font-black uppercase text-white/20">Authorized Hirer Authentication</span>
                      <p className="text-[10px] font-black text-white uppercase mt-2">{selectedOrder.customer_name}</p>
                    </div>
                    <div className="border-t border-white/10 pt-4 text-right">
                      <span className="text-[8px] font-black uppercase text-white/20">Justice Corporate Admin Alpha</span>
                      <p className="text-[10px] font-black text-primary uppercase mt-2">Verified Transmission</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 bg-black/80 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white/30">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[8px] font-mono uppercase tracking-widest">Protocol Sync Status: {isSavingContract ? "Establishing Link..." : "Encrypted Link Active"}</span>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsEditingContract(false)}
                  className="px-8 h-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all"
                >
                  Abort Editor
                </button>
                <button
                  onClick={saveContractDetails}
                  disabled={isSavingContract}
                  className="px-8 h-12 text-[10px] font-black uppercase tracking-[0.3em] bg-white text-black hover:bg-white/80 transition-all rounded-sm flex items-center gap-3"
                >
                  <Save className="w-4 h-4" />
                  Save Meta-Data
                </button>
                <button
                  onClick={handleContractDownload}
                  className="btn-scan px-10 h-12 flex items-center gap-3"
                >
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                  Execute PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mission Detail Terminal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-black border border-white/10 rounded-sm w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-black uppercase tracking-widest text-white">Registry Detail // Mission Oversight</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-white/30 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              {/* Asset Config */}
              <div className="flex gap-6 p-6 border border-white/5 bg-white/[0.02] rounded-sm">
                {selectedOrder.vehicles?.image_url && (
                  <img src={selectedOrder.vehicles.image_url} alt="Unit" className="w-32 h-24 object-cover border border-white/10 rounded-sm" />
                )}
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">{selectedOrder.vehicles?.name}</h4>
                  <p className="text-2xl font-black text-primary"><span className="text-xs mr-2">KSh</span>{selectedOrder.vehicles?.price_per_day.toLocaleString()}</p>
                </div>
              </div>

              {/* Mission Data Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <span className="block text-[8px] font-bold uppercase tracking-widest text-white/20 mb-1">Personnel</span>
                    <p className="text-[11px] font-black uppercase tracking-widest text-white">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold uppercase tracking-widest text-white/20 mb-1">Node</span>
                    <p className="text-[10px] font-mono text-white/60">{selectedOrder.customer_email}</p>
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold uppercase tracking-widest text-white/20 mb-1">Comms</span>
                    <p className="text-[10px] font-mono text-white/60">{selectedOrder.customer_phone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="block text-[8px] font-bold uppercase tracking-widest text-white/20 mb-1">Temporal Range</span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white">
                      {format(new Date(selectedOrder.pickup_date), "yyyy.MM.dd")} - {format(new Date(selectedOrder.return_date), "yyyy.MM.dd")}
                    </p>
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold uppercase tracking-widest text-white/20 mb-1">Operational Hub</span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white">{selectedOrder.pickup_location || "CENTRAL TERMINAL"}</p>
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold uppercase tracking-widest text-white/20 mb-1">Comm Protocol</span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      {selectedOrder.preferred_contact === "whatsapp" && <MessageCircle className="w-3 h-3" />}
                      {selectedOrder.preferred_contact} Secure
                    </p>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="p-6 bg-white/[0.02] border border-white/5 border-l-primary border-l-2">
                  <span className="block text-[8px] font-bold uppercase tracking-widest text-white/20 mb-3">Personnel Log Entry</span>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 leading-relaxed italic">"{selectedOrder.notes}"</p>
                </div>
              )}

              {/* Admin Oversight Input */}
              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 ml-1">Command Dispatch Notes (Email Secure)</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="audit-input w-full bg-white/[0.03] border border-white/10 rounded-sm p-6 text-[11px] text-white uppercase resize-none"
                  placeholder="ENTER MISSION OVERSIGHT DATA..."
                />
              </div>

              {/* Command Actions */}
              <div className="space-y-3 pt-6 border-t border-white/10">
                <a
                  href={getContactLink(selectedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-outline-terminal h-14 flex items-center justify-center gap-4 text-green-500 hover:border-green-500/50"
                >
                  <MessageCircle className="w-5 h-5" />
                  Establish Secure Line via {selectedOrder.preferred_contact}
                </a>

                {selectedOrder.status === "pending" && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => updateStatus(selectedOrder.id, "approved", true)}
                      disabled={sendingEmail}
                      className="flex-1 btn-scan h-14 flex items-center justify-center gap-3 disabled:opacity-30"
                    >
                      {sendingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                      Approve & Dispatch
                    </button>
                    <button
                      onClick={() => updateStatus(selectedOrder.id, "rejected", true)}
                      disabled={sendingEmail}
                      className="flex-1 border border-red-500/20 bg-red-500/5 text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-500/10 transition-all disabled:opacity-30"
                    >
                      {sendingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
                      Reject Mission
                    </button>
                  </div>
                )}

                {selectedOrder.status === "approved" && (
                  <button
                    onClick={() => updateStatus(selectedOrder.id, "completed", true)}
                    disabled={sendingEmail}
                    className="w-full btn-scan h-14 flex items-center justify-center gap-3 disabled:opacity-30"
                  >
                    {sendingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    Confirm Operational Completion
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
