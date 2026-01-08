export interface Vehicle {
  id: string;
  name: string;
  category: string;
  seats: number;
  transmission: "Automatic" | "Manual";
  fuel: string;
  engine: string;
  pricePerDay: number;
  pricePerWeek: number;
  driverFee: number;
  image: string;
  features: string[];
  status: "available" | "booked" | "maintenance";
  isPopular?: boolean;
  isExecutive?: boolean;
}

export const vehicles: Vehicle[] = [
  {
    id: "1",
    name: "Toyota Land Cruiser Prado TX",
    category: "SUV",
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    engine: "2800cc",
    pricePerDay: 18000,
    pricePerWeek: 120000,
    driverFee: 3000,
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
    features: ["Air Conditioning", "GPS Navigation", "Leather Seats", "Sunroof", "4WD"],
    status: "available",
    isPopular: true,
  },
  {
    id: "2",
    name: "Mercedes-Benz E-Class",
    category: "Luxury",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    engine: "2000cc",
    pricePerDay: 25000,
    pricePerWeek: 165000,
    driverFee: 4000,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
    features: ["Air Conditioning", "GPS Navigation", "Leather Seats", "Premium Audio", "Climate Control"],
    status: "available",
    isExecutive: true,
  },
  {
    id: "3",
    name: "Toyota Hiace (14 Seater)",
    category: "Van",
    seats: 14,
    transmission: "Manual",
    fuel: "Diesel",
    engine: "3000cc",
    pricePerDay: 12000,
    pricePerWeek: 78000,
    driverFee: 2500,
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80",
    features: ["Air Conditioning", "Spacious Interior", "Luggage Space", "PA System"],
    status: "available",
  },
  {
    id: "4",
    name: "Toyota Fortuner",
    category: "SUV",
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    engine: "2800cc",
    pricePerDay: 15000,
    pricePerWeek: 98000,
    driverFee: 3000,
    image: "https://images.unsplash.com/photo-1625231334168-20988a5f09a5?w=800&q=80",
    features: ["Air Conditioning", "GPS Navigation", "Leather Seats", "4WD", "Cruise Control"],
    status: "available",
    isPopular: true,
  },
  {
    id: "5",
    name: "Toyota Axio",
    category: "Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    engine: "1500cc",
    pricePerDay: 5000,
    pricePerWeek: 32000,
    driverFee: 2000,
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80",
    features: ["Air Conditioning", "Fuel Efficient", "Compact", "Easy Parking"],
    status: "available",
  },
  {
    id: "6",
    name: "Range Rover Vogue",
    category: "Luxury",
    seats: 5,
    transmission: "Automatic",
    fuel: "Diesel",
    engine: "4400cc",
    pricePerDay: 45000,
    pricePerWeek: 280000,
    driverFee: 5000,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    features: ["Air Conditioning", "GPS Navigation", "Premium Leather", "Panoramic Roof", "4WD", "Massage Seats"],
    status: "available",
    isExecutive: true,
  },
  {
    id: "7",
    name: "Nissan X-Trail",
    category: "SUV",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    engine: "2500cc",
    pricePerDay: 10000,
    pricePerWeek: 65000,
    driverFee: 2500,
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80",
    features: ["Air Conditioning", "GPS Navigation", "Spacious Boot", "AWD"],
    status: "booked",
  },
  {
    id: "8",
    name: "Toyota Coaster (33 Seater)",
    category: "Bus",
    seats: 33,
    transmission: "Manual",
    fuel: "Diesel",
    engine: "4200cc",
    pricePerDay: 25000,
    pricePerWeek: 160000,
    driverFee: 4000,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
    features: ["Air Conditioning", "PA System", "Reclining Seats", "Luggage Compartment"],
    status: "available",
  },
];

export const categories = [
  "All",
  "SUV",
  "Sedan",
  "Luxury",
  "Van",
  "Bus",
  "4x4",
];
