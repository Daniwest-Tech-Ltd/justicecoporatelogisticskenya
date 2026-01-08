import { Shield, Clock, Users, Award, Headphones, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "NTSA Compliant Fleet",
    description: "All our vehicles meet NTSA safety and compliance standards",
  },
  {
    icon: CheckCircle,
    title: "Fully Insured",
    description: "Comprehensive insurance coverage for your peace of mind",
  },
  {
    icon: Users,
    title: "Professional Drivers",
    description: "Experienced, licensed chauffeurs available on request",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer support for any emergencies",
  },
  {
    icon: Award,
    title: "Corporate Ready",
    description: "Trusted by government and corporate clients across Kenya",
  },
  {
    icon: Headphones,
    title: "Easy Booking",
    description: "Simple online booking with M-Pesa payment integration",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Why Rent With Us?</h2>
          <p className="section-subtitle mx-auto">
            Justice Corporate Logistics Kenya offers the most reliable and professional car rental services
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card-hover p-6 text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/20 text-primary mb-4">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
