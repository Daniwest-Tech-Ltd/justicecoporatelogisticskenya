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
  Zap
} from "lucide-react";
import { format } from "date-fns";
import { generateOrdersPDF } from "@/utils/pdfGenerator";

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

  useEffect(() => {
    fetchOrders();
  }, []);

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
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 border rounded-sm text-[8px] font-black uppercase tracking-widest ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setAdminNotes(order.admin_notes || "");
                    }}
                    className="p-3 border border-white/10 bg-white/5 hover:bg-primary transition-all rounded-sm group/btn"
                  >
                    <Eye className="w-4 h-4 text-white/40 group-hover/btn:text-white transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
