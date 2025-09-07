const mongoose = require('mongoose');
const Taxi = require('../models/Taxi');
const User = require('../models/User');
require('dotenv').config();

const sampleTaxis = [
  {
    name: "Swift Dzire",
    description: "Comfortable sedan perfect for city rides and short trips. Features AC, comfortable seating, and professional driver.",
    type: "Sedan",
    category: "city",
    basePrice: 0,
    pricePerKm: 10,
    pricePerHour: 0,
    minimumFare: 100,
    capacity: 4,
    features: ["Driver", "Fuel", "Water", "Parking", "Toll-Tax", "AC"],
    image: "/images/swift-dzire.jpg",
    availableAreas: ["Jaipur", "Delhi", "Mumbai", "Bangalore"],
    fuelType: "Petrol",
    transmission: "Manual",
    ac: true,
    driverIncluded: true,
    tags: ["sedan", "city", "economy"]
  },
  {
    name: "Toyota Etios",
    description: "Reliable sedan with excellent fuel efficiency and comfortable ride for city and highway travel.",
    type: "Sedan",
    category: "city",
    basePrice: 0,
    pricePerKm: 10,
    pricePerHour: 0,
    minimumFare: 100,
    capacity: 4,
    features: ["Driver", "Fuel", "Water", "Parking", "Toll-Tax", "AC"],
    image: "/images/toyota-etios.jpg",
    availableAreas: ["Jaipur", "Delhi", "Mumbai", "Bangalore"],
    fuelType: "Petrol",
    transmission: "Manual",
    ac: true,
    driverIncluded: true,
    tags: ["sedan", "city", "reliable"]
  },
  {
    name: "Toyota Innova",
    description: "Spacious SUV perfect for family trips and group travel. Comfortable seating for up to 7 passengers.",
    type: "SUV",
    category: "outstation",
    basePrice: 0,
    pricePerKm: 15,
    pricePerHour: 0,
    minimumFare: 200,
    capacity: 7,
    features: ["Driver", "Fuel", "Water", "Parking", "Toll-Tax", "AC"],
    image: "/images/toyota-innova.jpg",
    availableAreas: ["Jaipur", "Delhi", "Mumbai", "Bangalore", "Goa"],
    fuelType: "Diesel",
    transmission: "Manual",
    ac: true,
    driverIncluded: true,
    tags: ["suv", "family", "outstation"]
  },
  {
    name: "Innova Crysta",
    description: "Premium SUV with advanced features and superior comfort. Perfect for luxury travel and business trips.",
    type: "SUV",
    category: "outstation",
    basePrice: 0,
    pricePerKm: 16,
    pricePerHour: 0,
    minimumFare: 250,
    capacity: 7,
    features: ["Driver", "Fuel", "Water", "Parking", "Toll-Tax", "AC", "Premium Interior"],
    image: "/images/innova-crysta.jpg",
    availableAreas: ["Jaipur", "Delhi", "Mumbai", "Bangalore", "Goa"],
    fuelType: "Diesel",
    transmission: "Manual",
    ac: true,
    driverIncluded: true,
    tags: ["suv", "premium", "luxury"]
  },
  {
    name: "Ertiga",
    description: "Versatile MPV offering great value for money. Comfortable for both city and highway travel.",
    type: "Mini Bus",
    category: "city",
    basePrice: 0,
    pricePerKm: 14,
    pricePerHour: 0,
    minimumFare: 150,
    capacity: 7,
    features: ["Driver", "Fuel", "Water", "Parking", "Toll-Tax", "AC"],
    image: "/images/ertiga.jpg",
    availableAreas: ["Jaipur", "Delhi", "Mumbai", "Bangalore"],
    fuelType: "Petrol",
    transmission: "Manual",
    ac: true,
    driverIncluded: true,
    tags: ["mpv", "family", "versatile"]
  },
  {
    name: "Kia Carens",
    description: "Modern MPV with contemporary design and advanced features. Perfect for comfortable group travel.",
    type: "Mini Bus",
    category: "city",
    basePrice: 0,
    pricePerKm: 15,
    pricePerHour: 0,
    minimumFare: 180,
    capacity: 7,
    features: ["Driver", "Fuel", "Water", "Parking", "Toll-Tax", "AC", "Modern Features"],
    image: "/images/kia-carens.jpg",
    availableAreas: ["Jaipur", "Delhi", "Mumbai", "Bangalore"],
    fuelType: "Petrol",
    transmission: "Manual",
    ac: true,
    driverIncluded: true,
    tags: ["mpv", "modern", "comfortable"]
  },
  {
    name: "12 Seater Tempo Traveller",
    description: "Perfect for group travel and corporate outings. Spacious and comfortable for up to 12 passengers.",
    type: "Tempo Traveller",
    category: "outstation",
    basePrice: 0,
    pricePerKm: 22,
    pricePerHour: 0,
    minimumFare: 300,
    capacity: 12,
    features: ["Driver", "Fuel", "Water", "Parking", "Toll-Tax", "AC"],
    image: "/images/tempo-12.jpg",
    availableAreas: ["Jaipur", "Delhi", "Mumbai", "Bangalore", "Goa", "Rajasthan"],
    fuelType: "Diesel",
    transmission: "Manual",
    ac: true,
    driverIncluded: true,
    tags: ["group", "corporate", "outstation"]
  },
  {
    name: "17 Seater Tempo Traveller",
    description: "Large capacity vehicle ideal for big groups and corporate events. Comfortable seating for 17 passengers.",
    type: "Tempo Traveller",
    category: "outstation",
    basePrice: 0,
    pricePerKm: 25,
    pricePerHour: 0,
    minimumFare: 400,
    capacity: 17,
    features: ["Driver", "Fuel", "Water", "Parking", "Toll-Tax", "AC"],
    image: "/images/tempo-17.jpg",
    availableAreas: ["Jaipur", "Delhi", "Mumbai", "Bangalore", "Goa", "Rajasthan"],
    fuelType: "Diesel",
    transmission: "Manual",
    ac: true,
    driverIncluded: true,
    tags: ["large-group", "corporate", "events"]
  },
  {
    name: "20 Seater Tempo Traveller",
    description: "Maximum capacity vehicle for large group travel. Perfect for school trips and corporate events.",
    type: "Tempo Traveller",
    category: "outstation",
    basePrice: 0,
    pricePerKm: 27,
    pricePerHour: 0,
    minimumFare: 500,
    capacity: 20,
    features: ["Driver", "Fuel", "Water", "Parking", "Toll-Tax", "AC"],
    image: "/images/tempo-20.jpg",
    availableAreas: ["Jaipur", "Delhi", "Mumbai", "Bangalore", "Goa", "Rajasthan"],
    fuelType: "Diesel",
    transmission: "Manual",
    ac: true,
    driverIncluded: true,
    tags: ["large-group", "school-trips", "events"]
  },
  {
    name: "Force Urbania",
    description: "Premium bus service for large group travel. Comfortable and spacious with modern amenities.",
    type: "Bus",
    category: "outstation",
    basePrice: 0,
    pricePerKm: 35,
    pricePerHour: 0,
    minimumFare: 800,
    capacity: 25,
    features: ["Driver", "Fuel", "Water", "Parking", "Toll-Tax", "AC", "Premium Seating"],
    image: "/images/force-urbania.jpg",
    availableAreas: ["Jaipur", "Delhi", "Mumbai", "Bangalore", "Goa", "Rajasthan"],
    fuelType: "Diesel",
    transmission: "Manual",
    ac: true,
    driverIncluded: true,
    tags: ["bus", "premium", "large-group"]
  },
  {
    name: "Luxury Cabs",
    description: "Premium sedan service for business and luxury travel. Features high-end vehicles with professional chauffeurs.",
    type: "Luxury",
    category: "airport",
    basePrice: 0,
    pricePerKm: 20,
    pricePerHour: 0,
    minimumFare: 500,
    capacity: 4,
    features: ["Professional Driver", "Fuel", "Water", "Parking", "Toll-Tax", "AC", "Luxury Interior"],
    image: "/images/luxury-cab.jpg",
    availableAreas: ["Jaipur", "Delhi", "Mumbai", "Bangalore"],
    fuelType: "Petrol",
    transmission: "Automatic",
    ac: true,
    driverIncluded: true,
    tags: ["luxury", "business", "premium"]
  },
  {
    name: "Luxury Bus",
    description: "Premium bus service with luxury amenities. Perfect for corporate events and special occasions.",
    type: "Bus",
    category: "intercity",
    basePrice: 0,
    pricePerKm: 45,
    pricePerHour: 0,
    minimumFare: 1000,
    capacity: 35,
    features: ["Professional Driver", "Fuel", "Water", "Parking", "Toll-Tax", "AC", "Luxury Seating", "Entertainment"],
    image: "/images/luxury-bus.jpg",
    availableAreas: ["Jaipur", "Delhi", "Mumbai", "Bangalore", "Goa", "Rajasthan"],
    fuelType: "Diesel",
    transmission: "Manual",
    ac: true,
    driverIncluded: true,
    tags: ["luxury", "premium", "corporate"]
  }
];

async function seedTaxis() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/isg-travels');
    console.log('Connected to MongoDB');

    // Find or create an admin user
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@isgtravels.com',
        phone: '9999999999',
        password: 'admin123',
        role: 'admin',
        isVerified: true
      });
      console.log('Created admin user');
    }

    // Clear existing taxis
    await Taxi.deleteMany({});
    console.log('Cleared existing taxis');

    // Create taxis with admin as creator
    const taxisWithAdmin = sampleTaxis.map(taxi => ({
      ...taxi,
      createdBy: adminUser._id
    }));

    const createdTaxis = await Taxi.insertMany(taxisWithAdmin);
    console.log(`Created ${createdTaxis.length} taxi services`);

    console.log('Taxi seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding taxis:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedTaxis();

