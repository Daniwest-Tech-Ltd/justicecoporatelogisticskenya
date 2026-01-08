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
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

      // Fetch all orders with vehicle data directly from rental_orders
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

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        throw ordersError;
      }

      console.log("Fetched orders:", orders);

      // Store recent orders for display
      setRecentOrders((orders as RentalOrder[])?.slice(0, 5) || []);

      // Calculate order statistics from actual data
      const stats = {
        total: orders?.length || 0,
        pending: orders?.filter((o) => o.status === "pending").length || 0,
        approved: orders?.filter((o) => o.status === "approved").length || 0,
        completed: orders?.filter((o) => o.status === "completed").length || 0,
        rejected: orders?.filter((o) => o.status === "rejected").length || 0,
      };
      setOrderStats(stats);

      // Calculate status distribution for pie chart
      const statusDistribution = [
        { name: "Pending", value: stats.pending, color: "#eab308" },
        { name: "Approved", value: stats.approved, color: "#22c55e" },
        { name: "Completed", value: stats.completed, color: "#3b82f6" },
        { name: "Rejected", value: stats.rejected, color: "#ef4444" },
      ].filter(s => s.value > 0);
      setStatusData(statusDistribution.length > 0 ? statusDistribution : [
        { name: "No Orders", value: 1, color: "#6b7280" }
      ]);

      // Calculate revenue by month from actual orders
      const monthlyData: { [key: string]: { revenue: number; orders: number } } = {};
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      // Initialize all months
      months.forEach((month) => {
        monthlyData[month] = { revenue: 0, orders: 0 };
      });

      let totalRev = 0;
      orders?.forEach((order) => {
        const orderDate = new Date(order.created_at);
        const monthName = months[orderDate.getMonth()];
        const vehicle = order.vehicles;
        
        // Count all orders for the month
        monthlyData[monthName].orders += 1;
        
        // Calculate revenue only for approved/completed orders
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

      // Calculate popular vehicles from actual bookings
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

      // Also try to fetch from analytics tables (if they have data from triggers)
      try {
        const { data: vehicleAnalytics } = await supabase
          .from("vehicle_analytics")
          .select("*")
          .order("total_bookings", { ascending: false })
          .limit(5);
        
        if (vehicleAnalytics && vehicleAnalytics.length > 0) {
          console.log("Vehicle analytics from DB:", vehicleAnalytics);
        }
      } catch (e) {
        console.log("Vehicle analytics table not accessible or empty");
      }

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

  return (
    <div className="space-y-6">
      {/* Header with Refresh and Export */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-heading text-xl font-bold">Analytics Overview</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportPDF}
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchAnalytics}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

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

      {/* Recent Orders */}
      <div className="glass-card p-6">
        <h2 className="font-heading text-lg font-bold mb-6">Recent Orders</h2>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vehicle</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Dates</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium">{order.vehicles?.name || 'N/A'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm">
                        {new Date(order.pickup_date).toLocaleDateString()} - {new Date(order.return_date).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        order.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                        order.status === 'completed' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No orders yet</p>
            <p className="text-sm">Orders will appear here once customers book vehicles</p>
          </div>
        )}
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
