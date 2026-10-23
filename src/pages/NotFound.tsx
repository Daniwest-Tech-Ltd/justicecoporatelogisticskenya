import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 pt-20">
        <div className="text-center">
          <div className="p-12 max-w-lg mx-auto border border-white/10 bg-black/40 backdrop-blur-md rounded-sm">
            <h1 className="font-heading text-8xl font-bold text-primary mb-4">404</h1>
            <h2 className="font-heading text-2xl font-bold text-white mb-4">Page Not Found</h2>
            <p className="text-white/60 mb-8 text-xs font-mono uppercase tracking-widest leading-relaxed">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
              <button onClick={() => window.history.back()} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all">
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
