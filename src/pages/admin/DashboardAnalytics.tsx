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
  TrendingDown,
  DollarSign,
  Car,
  Users,
  Package,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

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
}

interface StatusData {
  name: string;
  value: number;
  color: string;
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
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch all orders with vehicle data
      const { data: orders, error: ordersError } = await supabase
        .from("rental_orders")
        .select(`
          *,
          vehicles:vehicle_id (
            id,
            name,
            price_per_day,
            image_url
          )
        `);

      if (ordersError) throw ordersError;

      // Calculate order statistics
      const stats = {
        total: orders?.length || 0,
        pending: orders?.filter((o) => o.status === "pending").length || 0,
        approved: orders?.filter((o) => o.status === "approved").length || 0,
        completed: orders?.filter((o) => o.status === "completed").length || 0,
        rejected: orders?.filter((o) => o.status === "rejected").length || 0,
      };
      setOrderStats(stats);

      // Calculate status distribution for pie chart
      setStatusData([
        { name: "Pending", value: stats.pending, color: "#eab308" },
        { name: "Approved", value: stats.approved, color: "#22c55e" },
        { name: "Completed", value: stats.completed, color: "#3b82f6" },
        { name: "Rejected", value: stats.rejected, color: "#ef4444" },
      ]);

      // Calculate revenue by month
      const monthlyData: { [key: string]: { revenue: number; orders: number } } = {};
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      // Initialize all months
      months.forEach((month) => {
        monthlyData[month] = { revenue: 0, orders: 0 };
      });

      let totalRev = 0;
      orders?.forEach((order) => {
        if (order.status === "approved" || order.status === "completed") {
          const orderDate = new Date(order.created_at);
          const monthName = months[orderDate.getMonth()];
          const vehicle = order.vehicles as any;
          
          if (vehicle?.price_per_day && order.pickup_date && order.return_date) {
            const pickupDate = new Date(order.pickup_date);
            const returnDate = new Date(order.return_date);
            const days = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
            const orderRevenue = vehicle.price_per_day * Math.max(1, days);
            
            monthlyData[monthName].revenue += orderRevenue;
            monthlyData[monthName].orders += 1;
            totalRev += orderRevenue;
          }
        }
      });

      setTotalRevenue(totalRev);
      setRevenueData(months.map((month) => ({
        month,
        revenue: monthlyData[month].revenue,
        orders: monthlyData[month].orders,
      })));

      // Calculate popular vehicles
      const vehicleBookings: { [key: string]: PopularVehicle } = {};
      orders?.forEach((order) => {
        const vehicle = order.vehicles as any;
        if (vehicle) {
          if (!vehicleBookings[vehicle.id]) {
            vehicleBookings[vehicle.id] = {
              name: vehicle.name,
              bookings: 0,
              revenue: 0,
              image_url: vehicle.image_url,
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-500/20 text-green-500">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-green-500 text-sm">
              <TrendingUp className="w-4 h-4" />
              Revenue
            </span>
          </div>
          <h3 className="text-2xl font-bold">{formatCurrency(totalRevenue)}</h3>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/20 text-blue-500">
              <Package className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-blue-500 text-sm">
              <Calendar className="w-4 h-4" />
              All Time
            </span>
          </div>
          <h3 className="text-2xl font-bold">{orderStats.total}</h3>
          <p className="text-sm text-muted-foreground">Total Orders</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-500/20 text-yellow-500">
              <Clock className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-yellow-500 text-sm">
              Action Needed
            </span>
          </div>
          <h3 className="text-2xl font-bold">{orderStats.pending}</h3>
          <p className="text-sm text-muted-foreground">Pending Orders</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-500">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-emerald-500 text-sm">
              <TrendingUp className="w-4 h-4" />
              Success
            </span>
          </div>
          <h3 className="text-2xl font-bold">{orderStats.completed}</h3>
          <p className="text-sm text-muted-foreground">Completed Rentals</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="font-heading text-lg font-bold mb-6">Revenue Overview</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Pie Chart */}
        <div className="glass-card p-6">
          <h2 className="font-heading text-lg font-bold mb-6">Order Status</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Orders by Month Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="font-heading text-lg font-bold mb-6">Monthly Orders</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar 
                  dataKey="orders" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Vehicles */}
        <div className="glass-card p-6">
          <h2 className="font-heading text-lg font-bold mb-6">Popular Vehicles</h2>
          {popularVehicles.length > 0 ? (
            <div className="space-y-4">
              {popularVehicles.map((vehicle, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted">
                    {vehicle.image_url ? (
                      <img 
                        src={vehicle.image_url} 
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{vehicle.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.bookings} booking{vehicle.bookings !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-500">
                      {formatCurrency(vehicle.revenue)}
                    </p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No booking data yet</p>
              <p className="text-sm">Popular vehicles will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">Pending</span>
          </div>
          <p className="text-2xl font-bold text-yellow-500">{orderStats.pending}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="font-medium">Approved</span>
          </div>
          <p className="text-2xl font-bold text-green-500">{orderStats.approved}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Package className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Completed</span>
          </div>
          <p className="text-2xl font-bold text-blue-500">{orderStats.completed}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <span className="font-medium">Rejected</span>
          </div>
          <p className="text-2xl font-bold text-red-500">{orderStats.rejected}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
