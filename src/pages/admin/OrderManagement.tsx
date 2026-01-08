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
  Send,
  FileDown
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
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

    // Send email notification for approval/rejection
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

        toast({ 
          title: "Success", 
          description: `Order ${status} and email sent to ${order.customer_email}` 
        });
      } catch (emailError) {
        console.error("Email failed:", emailError);
        toast({ 
          title: "Order Updated", 
          description: `Order ${status} but email notification failed.`,
          variant: "destructive"
        });
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
      default:
        return "#";
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-500",
      approved: "bg-green-500/20 text-green-500",
      rejected: "bg-red-500/20 text-red-500",
      completed: "bg-blue-500/20 text-blue-500",
      cancelled: "bg-gray-500/20 text-gray-500",
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-heading text-xl font-bold">Rental Orders</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportPDF}
            disabled={filteredOrders.length === 0}
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          {["all", "pending", "approved", "rejected", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === status ? "bg-primary text-primary-foreground" : "glass-button"
              }`}
            >
              {status}
              {status === "pending" && orders.filter(o => o.status === "pending").length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-yellow-500 text-black">
                  {orders.filter(o => o.status === "pending").length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-lg font-medium mb-2">No orders yet</p>
          <p className="text-muted-foreground">Orders will appear here when customers request rentals</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="glass-card p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Vehicle Info */}
                <div className="flex items-center gap-4 flex-1">
                  {order.vehicles?.image_url ? (
                    <img
                      src={order.vehicles.image_url}
                      alt={order.vehicles?.name}
                      className="w-20 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <Car className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{order.vehicles?.name || "Vehicle"}</h3>
                    <p className="text-sm text-muted-foreground">
                      KSh {order.vehicles?.price_per_day.toLocaleString()}/day
                    </p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="flex-1">
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                  <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                </div>

                {/* Dates */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{format(new Date(order.pickup_date), "MMM d")} - {format(new Date(order.return_date), "MMM d, yyyy")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Requested: {format(new Date(order.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setAdminNotes(order.admin_notes || "");
                    }}
                    className="glass-button p-2"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl font-bold">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vehicle */}
            <div className="flex gap-4 mb-6 pb-6 border-b border-border">
              {selectedOrder.vehicles?.image_url && (
                <img
                  src={selectedOrder.vehicles.image_url}
                  alt={selectedOrder.vehicles?.name}
                  className="w-24 h-20 object-cover rounded-lg"
                />
              )}
              <div>
                <h4 className="font-semibold">{selectedOrder.vehicles?.name}</h4>
                <p className="text-primary font-bold">
                  KSh {selectedOrder.vehicles?.price_per_day.toLocaleString()}/day
                </p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{selectedOrder.customer_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedOrder.customer_phone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Preferred Contact Method</p>
                <p className="font-medium capitalize flex items-center gap-2">
                  {selectedOrder.preferred_contact === "whatsapp" && <MessageCircle className="w-4 h-4" />}
                  {selectedOrder.preferred_contact === "email" && <Mail className="w-4 h-4" />}
                  {selectedOrder.preferred_contact === "sms" && <Phone className="w-4 h-4" />}
                  {selectedOrder.preferred_contact}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Pickup Date</p>
                  <p className="font-medium">{format(new Date(selectedOrder.pickup_date), "MMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Return Date</p>
                  <p className="font-medium">{format(new Date(selectedOrder.return_date), "MMM d, yyyy")}</p>
                </div>
              </div>
              {selectedOrder.pickup_location && (
                <div>
                  <p className="text-sm text-muted-foreground">Pickup Location</p>
                  <p className="font-medium">{selectedOrder.pickup_location}</p>
                </div>
              )}
              {selectedOrder.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Customer Notes</p>
                  <p className="font-medium bg-muted/50 p-3 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            {/* Admin Notes */}
            <div className="mb-6">
              <label className="text-sm text-muted-foreground block mb-2">Admin Notes (included in email)</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                className="glass-input resize-none bg-background w-full"
                placeholder="Add any notes for the customer..."
              />
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <a
                href={getContactLink(selectedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full glass-button py-3 flex items-center justify-center gap-2 text-green-500 hover:bg-green-500/10"
              >
                {selectedOrder.preferred_contact === "whatsapp" && <MessageCircle className="w-5 h-5" />}
                {selectedOrder.preferred_contact === "email" && <Mail className="w-5 h-5" />}
                {selectedOrder.preferred_contact === "sms" && <Phone className="w-5 h-5" />}
                Contact via {selectedOrder.preferred_contact}
              </a>
              
              {selectedOrder.status === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => updateStatus(selectedOrder.id, "approved", true)}
                    disabled={sendingEmail}
                    className="flex-1 btn-primary-gradient py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {sendingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    Approve & Send Email
                  </button>
                  <button
                    onClick={() => updateStatus(selectedOrder.id, "rejected", true)}
                    disabled={sendingEmail}
                    className="flex-1 glass-button py-3 flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {sendingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
                    Reject & Notify
                  </button>
                </div>
              )}

              {selectedOrder.status === "approved" && (
                <button
                  onClick={() => updateStatus(selectedOrder.id, "completed", true)}
                  disabled={sendingEmail}
                  className="w-full btn-primary-gradient py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {sendingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
