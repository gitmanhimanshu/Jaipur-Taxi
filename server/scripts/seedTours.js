const mongoose = require('mongoose');
const Tour = require('../models/Tour');
const User = require('../models/User');
require('dotenv').config();

const sampleTours = [
  {
    name: "Khattu Shayam JI Tour",
    description: "A spiritual journey to the famous Khatu Shayam Ji Temple, known for its divine blessings and peaceful atmosphere.",
    type: "1 Day Tour",
    duration: "9 AM - 6 PM",
    price: "On Request",
    category: "religious",
    image: "/images/khattu-shayam.jpg",
    features: ["Sightseeing", "Transfers", "Driver", "Fuel", "Water"],
    inclusions: [
      "Transportation in Sedan AC Taxi",
      "Driver Allowance & Fuel",
      "Professional Driver Cum Guide",
      "Water bottle",
      "Pickup & Drop From Jaipur Railway Station Or Bus Stop Area"
    ],
    places: ["Khatu Shayam JI Temple"],
    customizable: true,
    maxCapacity: 50,
    minCapacity: 1,
    tags: ["religious", "temple", "spiritual"]
  },
  {
    name: "Salasar Balaji Tour",
    description: "Visit the sacred Salasar Balaji Temple, one of the most revered temples in Rajasthan.",
    type: "1 Day Tour",
    duration: "9 AM - 6 PM",
    price: "On Request",
    category: "religious",
    image: "/images/salasar-balaji.jpg",
    features: ["Sightseeing", "Transfers", "Driver", "Fuel", "Water"],
    inclusions: [
      "Transportation in Sedan AC Taxi",
      "Driver Allowance & Fuel",
      "Professional Driver Cum Guide",
      "Water bottle",
      "Pickup & Drop From Jaipur Railway Station Or Bus Stop Area"
    ],
    places: ["Salasar Balaji Temple"],
    customizable: true,
    maxCapacity: 50,
    minCapacity: 1,
    tags: ["religious", "temple", "balaji"]
  },
  {
    name: "Jaipur Sightseeing Tour",
    description: "Explore the Pink City of Jaipur with its magnificent palaces, forts, and vibrant culture.",
    type: "1 Day Tour",
    duration: "9 AM - 6 PM",
    price: "999",
    originalPrice: "1499",
    discount: "33%",
    category: "city",
    image: "/images/jaipur-sightseeing.jpg",
    features: ["Sightseeing", "Transfers", "Driver", "Fuel", "Water"],
    inclusions: [
      "Transportation in Sedan AC Taxi",
      "Driver Allowance & Fuel",
      "Professional Driver Cum Guide",
      "Water bottle",
      "Pickup & Drop From Jaipur Railway Station Or Bus Stop Area"
    ],
    places: [
      "Amer Fort", "Mavtha Lake", "Jal Mahal", "Hawa Mahal", "Kanak Garden",
      "City Palace", "Jantar Mantar", "Albert Hall Museum", "Birla Temple",
      "Jaipur Local Market"
    ],
    customizable: true,
    maxCapacity: 50,
    minCapacity: 1,
    tags: ["city", "palace", "fort", "culture"]
  },
  {
    name: "Golden Triangle Tour Package",
    description: "Experience the best of North India with Delhi, Agra, and Jaipur in this comprehensive tour package.",
    type: "4 Nights / 5 Days",
    duration: "5 Days",
    price: "On Request",
    category: "multi-city",
    image: "/images/golden-triangle.jpg",
    features: ["Hotels", "Sightseeing", "Meals", "Transfers", "Water"],
    inclusions: [
      "A/c accommodation on dbl & Triple sharing",
      "Meal Plan Breakfast & Dinner Pure veg",
      "02 Nights Hotel Stay In Respective Room",
      "1 Days Jaipur Sightseeing",
      "1 Days Agra & Fatehpur Sikri Sightseeing",
      "1 Day Delhi Sightseeing",
      "Breakfast and Dinner",
      "Toll Tax, Parking, Fuel & Driver Allowance",
      "Pick Up and Drop From Jaipur railway station or airport"
    ],
    places: ["Jaipur", "Agra", "Fatehpur Sikri", "Delhi"],
    customizable: true,
    maxCapacity: 50,
    minCapacity: 1,
    tags: ["multi-city", "golden-triangle", "delhi", "agra", "jaipur"]
  },
  {
    name: "Royal Rajasthan Tour Package",
    description: "Discover the royal heritage of Rajasthan with this comprehensive tour covering major cities and attractions.",
    type: "7 Nights / 8 Days",
    duration: "8 Days",
    price: "On Request",
    category: "multi-city",
    image: "/images/royal-rajasthan.jpg",
    features: ["Hotels", "Sightseeing", "Meals", "Transfers", "Water"],
    inclusions: [
      "A/c accommodation on dbl & Triple sharing",
      "Meal Plan Breakfast & Dinner Pure veg",
      "07 Nights Hotel Stay In Respective Room",
      "Sighseeing & Transfers in Sedan & SUV Taxi (As per itinerary)",
      "2 Days Jaipur Sightseeing",
      "1 Day Ajmer Pushkar Sightseeing",
      "1 Day Udaipur Sightseeing",
      "1 Day Jodhpur Sightseeing",
      "1 Day Jaisalmer City Sightseeing",
      "1 Day Jaisalmer Desert Sightseeing",
      "Toll Tax, Parking, Fuel & Driver Allowance",
      "Pick Up and Drop From Jaipur railway station or airport"
    ],
    places: ["Jaipur", "Ajmer", "Pushkar", "Udaipur", "Jodhpur", "Jaisalmer"],
    customizable: true,
    maxCapacity: 50,
    minCapacity: 1,
    tags: ["rajasthan", "royal", "multi-city", "heritage"]
  }
];

async function seedTours() {
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

    // Clear existing tours
    await Tour.deleteMany({});
    console.log('Cleared existing tours');

    // Create tours with admin as creator
    const toursWithAdmin = sampleTours.map(tour => ({
      ...tour,
      createdBy: adminUser._id
    }));

    const createdTours = await Tour.insertMany(toursWithAdmin);
    console.log(`Created ${createdTours.length} tours`);

    console.log('Tour seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding tours:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedTours();


