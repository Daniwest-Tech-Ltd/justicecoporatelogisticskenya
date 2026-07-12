import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import SearchSection from "@/components/home/SearchSection";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import DriverCTA from "@/components/home/DriverCTA";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <SearchSection />
      <FeaturedVehicles />
      <WhyChooseUs />
      <DriverCTA />
      <CTASection />
    </Layout>
  );
};

export default Index;
