import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Mail, Lock, Eye, EyeOff, User, Phone, ShieldCheck, Fingerprint, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { signUpSchema, signInSchema, getPasswordStrength } from "@/lib/passwordValidation";
import PasswordStrengthIndicator from "@/components/auth/PasswordStrengthIndicator";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, signUp, signIn, isLoading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
  });

  const passwordStrength = getPasswordStrength(formData.password);

  useEffect(() => {
    if (!authLoading && user) {
      if (isAdmin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = signInSchema.safeParse({
          email: formData.email,
          password: formData.password,
        });

        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setIsLoading(false);
          return;
        }

        const { error } = await signIn(formData.email, formData.password);

        if (error) {
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        toast({
          title: "System Access Granted",
          description: "Authenticated successfully. Redirecting to terminal...",
        });
      } else {
        const result = signUpSchema.safeParse({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          fullName: formData.fullName,
          phone: formData.phone,
        });

        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.fullName,
          formData.phone
        );

        if (error) {
          toast({
            title: "Registration Error",
            description: error.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        toast({
          title: "Profile Created",
          description: "Please verify your email to activate full terminal access.",
        });
        setIsLogin(true);
      }
    } catch {
      toast({
        title: "System Error",
        description: "An unexpected error occurred in the authentication matrix.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-t-2 border-primary rounded-full animate-spin"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Decrypting Session...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-black relative flex items-center justify-center">
        {/* Background Visual Asset */}
        <div className="fixed inset-0 z-0">
          <img
            src="/rental 2.png"
            alt="Authentication Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-10" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-24 flex justify-center">
          <div className="w-full max-w-xl">
            {/* Header Interface */}
            <div className="flex flex-col items-center text-center mb-12 space-y-6">
              <div className="data-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-red" />
                {isLogin ? "Secure Terminal Access" : "Personnel Registry Protocol"}
              </div>
              <h1 className="heading-executive">
                {isLogin ? "Log" : "Sign"} <span className="text-primary">{isLogin ? "In" : "Up"}.</span>
              </h1>
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/50 leading-relaxed max-w-md">
                {isLogin 
                  ? "Enter your credentials to synchronize with the Justice Corporate operational network."
                  : "Initialize your profile to gain access to Africa's premier logistical infrastructure."}
              </p>
            </div>

            {/* Authentication Terminal */}
            <div className="p-8 md:p-12 border border-white/10 bg-black/60 backdrop-blur-xl rounded-sm relative overflow-hidden shadow-2xl">
              {/* Subtle technical accents */}
              <div className="absolute top-0 right-0 p-4">
                <Fingerprint className="w-5 h-5 text-white/5" />
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20">
                <div className="w-1/4 h-full bg-primary animate-[move-horizontal_3s_infinite]" />
              </div>

              {/* Mode Toggle */}
              <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-sm mb-10">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 h-12 text-[10px] font-black uppercase tracking-[0.3em] transition-all rounded-sm ${
                    isLogin ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/40 hover:text-white"
                  }`}
                >
                  Authenticate
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 h-12 text-[10px] font-black uppercase tracking-[0.3em] transition-all rounded-sm ${
                    !isLogin ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/40 hover:text-white"
                  }`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1 flex items-center gap-2">
                      <User className="w-3 h-3" /> Personnel Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-sm h-14 px-6 text-[11px] font-bold tracking-widest text-white placeholder:text-white/10 focus:border-primary/50 transition-all outline-none uppercase"
                      placeholder="FULL LEGAL NAME"
                    />
                    {errors.fullName && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">{errors.fullName}</p>}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1 flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Communication Node
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-sm h-14 px-6 text-[11px] font-bold tracking-widest text-white placeholder:text-white/10 focus:border-primary/50 transition-all outline-none uppercase"
                    placeholder="EMAIL ADDRESS"
                  />
                  {errors.email && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">{errors.email}</p>}
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1 flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Operational Code
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-sm h-14 px-6 text-[11px] font-bold tracking-widest text-white placeholder:text-white/10 focus:border-primary/50 transition-all outline-none uppercase"
                      placeholder="+254 PHONE NUMBER"
                    />
                    {errors.phone && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">{errors.phone}</p>}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1 flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Encryption Key
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-sm h-14 px-6 text-[11px] font-bold tracking-widest text-white placeholder:text-white/10 focus:border-primary/50 transition-all outline-none uppercase"
                      placeholder="PASSWORD"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">{errors.password}</p>}
                  {!isLogin && (
                    <PasswordStrengthIndicator strength={passwordStrength} show={formData.password.length > 0} />
                  )}
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1 flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3" /> Key Verification
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-sm h-14 px-6 text-[11px] font-bold tracking-widest text-white placeholder:text-white/10 focus:border-primary/50 transition-all outline-none uppercase"
                      placeholder="CONFIRM PASSWORD"
                    />
                    {errors.confirmPassword && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">{errors.confirmPassword}</p>}
                  </div>
                )}

                <div className="flex items-center justify-between py-2">
                  {isLogin && (
                    <Link to="/forgot-password" title="Initiate Key Recovery" className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline">
                      Lost Key?
                    </Link>
                  )}
                  {!isLogin && (
                    <div className="flex items-center gap-3">
                      <input type="checkbox" required className="accent-primary w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Agree to Protocols</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || (!isLogin && passwordStrength.score < 5)}
                  className="w-full bg-primary hover:bg-primary/90 text-white h-16 rounded-sm font-black uppercase tracking-[0.4em] text-[11px] transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>PROCESSING...</span>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" />
                      {isLogin ? "Authenticate Session" : "Establish Registry"}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes move-horizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </Layout>
  );
};

export default Auth;
