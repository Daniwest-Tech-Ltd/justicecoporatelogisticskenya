import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { signUpSchema, signInSchema, getPasswordStrength } from "@/lib/passwordValidation";
import PasswordStrengthIndicator from "@/components/auth/PasswordStrengthIndicator";
import logo from "@/assets/logo.png";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  // Redirect after successful login based on role
  useEffect(() => {
    if (!authLoading && user) {
      // Small delay to ensure isAdmin is updated
      setTimeout(() => {
        if (isAdmin) {
          navigate("/admin", { replace: true });
        } else {
          const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";
          navigate(from, { replace: true });
        }
      }, 100);
    }
  }, [user, isAdmin, authLoading, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (isLogin) {
        // Validate login
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
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Oops! Login Failed",
              description: "The email or password you entered doesn't match our records. Please try again.",
              variant: "destructive",
            });
          } else if (error.message.includes("Email not confirmed")) {
            toast({
              title: "Please Verify Your Email",
              description: "We sent you a verification link. Please check your inbox and spam folder.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Something Went Wrong",
              description: "We couldn't sign you in. Please try again later.",
              variant: "destructive",
            });
          }
          setIsLoading(false);
          return;
        }

        toast({
          title: "Welcome Back! 🎉",
          description: "Great to see you again. You're now signed in.",
        });
      } else {
        // Validate signup
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
          if (error.message.includes("User already registered")) {
            toast({
              title: "Account Already Exists",
              description: "Looks like you already have an account. Try signing in instead!",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Registration Failed",
              description: "We couldn't create your account. Please try again.",
              variant: "destructive",
            });
          }
          setIsLoading(false);
          return;
        }

        toast({
          title: "Account Created! 🎊",
          description: "Please check your email to verify your account before signing in.",
        });
        setIsLogin(true);
        setFormData({ ...formData, password: "", confirmPassword: "" });
      }
    } catch {
      toast({
        title: "Oops!",
        description: "Something unexpected happened. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  // Show loading if auth is still checking
  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="glass-card p-8">
            {/* Logo & Header */}
            <div className="text-center mb-8">
              <img src={logo} alt="Justice Corporate Logistics Kenya" className="h-20 mx-auto mb-4" />
              <h1 className="font-heading text-2xl font-bold mb-2">
                {isLogin ? "Welcome Back!" : "Join Our Family"}
              </h1>
              <p className="text-muted-foreground">
                {isLogin 
                  ? "Sign in to access your account and manage your rentals" 
                  : "Create an account to enjoy premium car rentals"}
              </p>
            </div>

            {/* Toggle Buttons */}
            <div className="flex mb-6 p-1 glass-card rounded-lg">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
                  isLogin ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
                  !isLogin ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name - Only for Register */}
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`glass-input pl-10 ${errors.fullName ? "border-red-500" : ""}`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`glass-input pl-10 ${errors.email ? "border-red-500" : ""}`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Phone - Only for Register */}
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`glass-input pl-10 ${errors.phone ? "border-red-500" : ""}`}
                      placeholder="0700 000 000"
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>
              )}

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`glass-input pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                
                {/* Password Strength - Only for Register */}
                {!isLogin && (
                  <PasswordStrengthIndicator 
                    strength={passwordStrength} 
                    show={formData.password.length > 0} 
                  />
                )}
              </div>

              {/* Confirm Password - Only for Register */}
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`glass-input pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>
              )}

              {/* Remember & Forgot - Only for Login */}
              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Terms - Only for Register */}
              {!isLogin && (
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" required className="rounded border-border mt-1" />
                  <span className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || (!isLogin && passwordStrength.score < 5)}
                className="btn-primary-gradient w-full py-3 font-semibold disabled:opacity-50"
              >
                {isLoading
                  ? isLogin
                    ? "Signing in..."
                    : "Creating your account..."
                  : isLogin
                  ? "Sign In"
                  : "Create My Account"}
              </button>

              {/* Toggle Link */}
              <p className="text-center text-sm text-muted-foreground">
                {isLogin ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsLogin(false)}
                      className="text-primary font-medium hover:underline"
                    >
                      Sign up for free
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className="text-primary font-medium hover:underline"
                    >
                      Sign in here
                    </button>
                  </>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
