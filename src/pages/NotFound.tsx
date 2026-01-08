import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="glass-card p-12 max-w-lg mx-auto">
            <h1 className="font-heading text-8xl font-bold text-primary mb-4">404</h1>
            <h2 className="font-heading text-2xl font-bold mb-4">Page Not Found</h2>
            <p className="text-muted-foreground mb-8">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="btn-primary-gradient flex items-center justify-center gap-2 px-6 py-3">
                <Home className="w-5 h-5" />
                Go Home
              </Link>
              <button onClick={() => window.history.back()} className="glass-button flex items-center justify-center gap-2 px-6 py-3">
                <ArrowLeft className="w-5 h-5" />
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
