import Layout from "@/components/layout/Layout";
import { Target, Eye, Users, Award, Shield, Clock } from "lucide-react";
import logo from "@/assets/logo.png";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <img src={logo} alt="Justice Corporate Logistics Kenya" className="h-24 mx-auto mb-6" />
          <h1 className="section-title mb-4">About Us</h1>
          <p className="section-subtitle mx-auto">
            Your trusted partner for premium car rental services in Kenya
          </p>
        </div>

        {/* Story Section */}
        <div className="glass-card p-8 md:p-12 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-2xl font-bold mb-6">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Justice Corporate Logistics Kenya was founded with a singular vision: to provide 
              reliable, professional, and affordable car rental services to individuals and 
              businesses across Kenya. What started as a small fleet has grown into one of 
              the most trusted names in the industry.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we proudly serve corporate clients, government agencies, event organizers, 
              and individual travelers. Our commitment to quality, safety, and customer 
              satisfaction remains at the core of everything we do.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="glass-card-hover p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/20 text-primary mb-4">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-4">Our Mission</h3>
            <p className="text-muted-foreground">
              To provide exceptional car rental services that exceed customer expectations 
              through a well-maintained fleet, professional service, and competitive pricing.
            </p>
          </div>
          <div className="glass-card-hover p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/20 text-primary mb-4">
              <Eye className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-4">Our Vision</h3>
            <p className="text-muted-foreground">
              To be the leading car rental company in East Africa, known for reliability, 
              innovation, and unmatched customer experience.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="section-title text-center mb-10">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Safety First",
                description: "All vehicles undergo rigorous maintenance and safety checks",
              },
              {
                icon: Users,
                title: "Customer Focus",
                description: "Your satisfaction is our top priority in every interaction",
              },
              {
                icon: Award,
                title: "Excellence",
                description: "We strive for excellence in service delivery",
              },
              {
                icon: Clock,
                title: "Reliability",
                description: "Dependable service you can count on, 24/7",
              },
            ].map((value, index) => (
              <div
                key={value.title}
                className="glass-card-hover p-6 text-center animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 text-primary mb-4">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="glass-card p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50+", label: "Vehicles in Fleet" },
              { value: "1000+", label: "Happy Customers" },
              { value: "5+", label: "Years Experience" },
              { value: "24/7", label: "Customer Support" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
