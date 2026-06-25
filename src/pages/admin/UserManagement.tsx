import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Phone, Calendar, Search, RefreshCw, Activity, ShieldCheck, Zap, Loader2 } from "lucide-react";

interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  email?: string;
  role?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      const usersWithRoles = (profiles || []).map((profile) => {
        const userRole = roles?.find((r) => r.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role || "user",
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center justify-between pb-6 border-b border-white/10 flex-wrap gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-sm">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Personnel Directory</h2>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Authenticated Registry Management</p>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          className="btn-outline-terminal h-10 flex items-center gap-3 px-6"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="text-[9px]">Refresh Registry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Search & Stats Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-8 bg-primary group-hover:h-full transition-all duration-700" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-3">
              <Search className="w-4 h-4" />
              Registry Query
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="ENTER PERSONNEL TELEMETRY..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="audit-input w-full h-14 bg-white/[0.03] border border-white/10 rounded-sm px-6 text-[10px] font-bold tracking-widest text-white placeholder:text-white/10 focus:border-primary/50 outline-none transition-all uppercase"
              />
              <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/5" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { label: "Global Personnel", value: users.length, id: "TOT_PRS", color: "text-white" },
              { label: "Alpha Admins", value: users.filter((u) => u.role === "admin").length, id: "ALP_ADM", color: "text-primary" },
              { label: "Standard Operators", value: users.filter((u) => u.role === "user").length, id: "STD_OPR", color: "text-blue-500" },
            ].map((stat) => (
              <div key={stat.id} className="p-6 border border-white/5 bg-black/20 backdrop-blur-[2px] rounded-sm flex justify-between items-center group hover:border-primary/30 transition-all">
                <div>
                  <span className="block text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">{stat.id}</span>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{stat.label}</p>
                </div>
                <p className={`text-2xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Directory Tactical Table */}
        <div className="lg:col-span-8">
          <div className="p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm relative overflow-hidden">
            {isLoading ? (
              <div className="p-20 text-center flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Decrypting Directory...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-20 text-center flex flex-col items-center gap-6">
                <User className="w-12 h-12 text-white/10" />
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30">No Match Found In current Registry</p>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-5 text-left text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Personnel Identity</th>
                      <th className="px-6 py-5 text-left text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Comms Node</th>
                      <th className="px-6 py-5 text-left text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Clearance</th>
                      <th className="px-6 py-5 text-left text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Registry Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-sm text-primary group-hover:bg-primary group-hover:text-white transition-all">
                              <User className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-black uppercase tracking-widest text-white">{user.full_name || "UNIDENTIFIED"}</p>
                              <p className="text-[8px] font-mono text-white/20 uppercase truncate">UID: {user.id.slice(0, 12)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3 text-[10px] font-mono text-white/40">
                            <Phone className="w-3 h-3 text-primary/40" />
                            {user.phone || "NODE_SILENT"}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span
                            className={`px-3 py-1 rounded-sm text-[8px] font-black uppercase tracking-widest border ${
                              user.role === "admin"
                                ? "bg-primary/10 text-primary border-primary/20"
                                : user.role === "moderator"
                                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                : "bg-white/5 text-white/40 border-white/10"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3 text-[10px] font-mono text-white/40">
                            <Calendar className="w-3 h-3 text-primary/40" />
                            {formatDate(user.created_at)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="absolute top-0 right-0 p-4 opacity-5">
              <ShieldCheck className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
