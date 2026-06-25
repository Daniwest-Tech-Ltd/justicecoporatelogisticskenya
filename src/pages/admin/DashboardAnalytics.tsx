import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Car,
  Package,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  FileDown,
  Activity,
  Zap,
  ShieldCheck
} from "lucide-react";
import { generateAnalyticsPDF } from "@/utils/pdfGenerator";

interface OrderStats {
  total: number;
  pending: number;
  approved: number;
  completed: number;
  rejected: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

interface PopularVehicle {
  name: string;
  bookings: number;
  revenue: number;
  image_url?: string;
  vehicle_id: string;
}

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface RentalOrder {
  id: string;
  vehicle_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_date: string;
  return_date: string;
  status: string;
  created_at: string;
  vehicles: {
    id: string;
    name: string;
    price_per_day: number;
    image_url: string | null;
  } | null;
}

const DashboardAnalytics = () => {
  const [orderStats, setOrderStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    rejected: 0,
  });
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [popularVehicles, setPopularVehicles] = useState<PopularVehicle[]>([]);
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [recentOrders, setRecentOrders] = useState<RentalOrder[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data: orders, error: ordersError } = await supabase
        .from("rental_orders")
        .select(`
          id,
          vehicle_id,
          customer_name,
          customer_email,
          customer_phone,
          pickup_date,
          return_date,
          status,
          created_at,
          notes,
          preferred_contact,
          pickup_location,
          vehicles:vehicle_id (
            id,
            name,
            price_per_day,
            image_url
          )
        `)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      setRecentOrders((orders as RentalOrder[])?.slice(0, 5) || []);

      const stats = {
        total: orders?.length || 0,
        pending: orders?.filter((o) => o.status === "pending").length || 0,
        approved: orders?.filter((o) => o.status === "approved").length || 0,
        completed: orders?.filter((o) => o.status === "completed").length || 0,
        rejected: orders?.filter((o) => o.status === "rejected").length || 0,
      };
      setOrderStats(stats);

      const statusDistribution = [
        { name: "Pending", value: stats.pending, color: "#eab308" },
        { name: "Approved", value: stats.approved, color: "#22c55e" },
        { name: "Completed", value: stats.completed, color: "#3b82f6" },
        { name: "Rejected", value: stats.rejected, color: "#ef4444" },
      ].filter(s => s.value > 0);
      setStatusData(statusDistribution.length > 0 ? statusDistribution : [
        { name: "No Orders", value: 1, color: "#1a1a1a" }
      ]);

      const monthlyData: { [key: string]: { revenue: number; orders: number } } = {};
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      months.forEach((month) => {
        monthlyData[month] = { revenue: 0, orders: 0 };
      });

      let totalRev = 0;
      orders?.forEach((order) => {
        const orderDate = new Date(order.created_at);
        const monthName = months[orderDate.getMonth()];
        const vehicle = order.vehicles;
        monthlyData[monthName].orders += 1;
        
        if ((order.status === "approved" || order.status === "completed") && vehicle?.price_per_day && order.pickup_date && order.return_date) {
          const pickupDate = new Date(order.pickup_date);
          const returnDate = new Date(order.return_date);
          const days = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
          const orderRevenue = vehicle.price_per_day * Math.max(1, days);
          monthlyData[monthName].revenue += orderRevenue;
          totalRev += orderRevenue;
        }
      });

      setTotalRevenue(totalRev);
      setRevenueData(months.map((month) => ({
        month,
        revenue: monthlyData[month].revenue,
        orders: monthlyData[month].orders,
      })));

      const vehicleBookings: { [key: string]: PopularVehicle } = {};
      orders?.forEach((order) => {
        const vehicle = order.vehicles;
        if (vehicle) {
          if (!vehicleBookings[vehicle.id]) {
            vehicleBookings[vehicle.id] = {
              name: vehicle.name,
              bookings: 0,
              revenue: 0,
              image_url: vehicle.image_url || undefined,
              vehicle_id: vehicle.id,
            };
          }
          vehicleBookings[vehicle.id].bookings += 1;
          if ((order.status === "approved" || order.status === "completed") && order.pickup_date && order.return_date) {
            const pickupDate = new Date(order.pickup_date);
            const returnDate = new Date(order.return_date);
            const days = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
            vehicleBookings[vehicle.id].revenue += vehicle.price_per_day * Math.max(1, days);
          }
        }
      });

      const sortedVehicles = Object.values(vehicleBookings)
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 5);
      setPopularVehicles(sortedVehicles);

    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleExportPDF = () => {
    generateAnalyticsPDF({
      totalRevenue,
      totalOrders: orderStats.total,
      pendingOrders: orderStats.pending,
      approvedOrders: orderStats.approved,
      completedOrders: orderStats.completed,
      rejectedOrders: orderStats.rejected,
      revenueData,
      popularVehicles,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Harvesting Intelligence Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center justify-between pb-6 border-b border-white/10 flex-wrap gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-sm">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Registry Intelligence</h2>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Global Analytics Oversight</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="btn-outline-terminal h-10 flex items-center gap-3 px-6"
          >
            <FileDown className="w-4 h-4" />
            <span className="text-[9px]">Generate Intelligence PDF</span>
          </button>
          <button
            onClick={fetchAnalytics}
            className="p-3 border border-white/10 bg-white/5 hover:bg-white/10 rounded-sm transition-all text-white/40 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Data Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, color: "text-green-500", id: "REV_METRIC" },
          { label: "Global Missions", value: orderStats.total, icon: Package, color: "text-blue-500", id: "ORD_METRIC" },
          { label: "Active Requests", value: orderStats.pending, icon: Clock, color: "text-yellow-500", id: "REQ_METRIC" },
          { label: "Completed Deployment", value: orderStats.completed, icon: CheckCircle, color: "text-emerald-500", id: "DPL_METRIC" },
        ].map((stat) => (
          <div key={stat.id} className="p-6 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm group hover:border-primary/50 transition-all relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-sm ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{stat.id}</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tighter mb-1">{stat.value}</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm">
          <div className="flex items-center gap-3 mb-8">
            <Activity className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">Revenue Trajectory</h2>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "2px", fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }}
                  formatter={(value: number) => [formatCurrency(value), "REVENUE"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">Sector Distribution</h2>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "2px", fontSize: "10px", fontWeight: "900" }}
                />
                <Legend iconType="rect" formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tactical Asset Ranking */}
        <div className="p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
            <Car className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">Strategic Asset Ranking</h2>
          </div>
          <div className="space-y-4">
            {popularVehicles.map((vehicle, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border border-white/5 bg-white/[0.01] rounded-sm group hover:bg-white/[0.03] transition-all">
                <div className="w-12 h-12 rounded-sm overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                  {vehicle.image_url ? (
                    <img src={vehicle.image_url} alt={vehicle.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-white/10">N/A</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-widest text-white truncate">{vehicle.name}</p>
                  <p className="text-[9px] font-mono text-white/30 uppercase">{vehicle.bookings} Deployment Cycles</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-black text-primary">{formatCurrency(vehicle.revenue)}</p>
                  <p className="text-[8px] font-mono text-white/20 uppercase">Yield</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Mission Log */}
        <div className="p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
            <Zap className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">Global Mission Log</h2>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Personnel</th>
                  <th className="text-left py-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Asset</th>
                  <th className="text-left py-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.01] transition-all group">
                    <td className="py-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white">{order.customer_name}</p>
                      <p className="text-[8px] font-mono text-white/20 uppercase truncate">{order.customer_email}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">{order.vehicles?.name || 'N/A'}</p>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 border rounded-sm text-[7px] font-black uppercase tracking-widest ${
                        order.status === 'pending' ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5' :
                        order.status === 'approved' ? 'text-green-500 border-green-500/20 bg-green-500/5' :
                        'text-blue-500 border-blue-500/20 bg-blue-500/5'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
