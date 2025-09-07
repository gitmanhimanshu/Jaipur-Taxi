import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Car, 
  Globe, 
  Shield, 
  Clock, 
  Star, 
  MapPin, 
  Phone, 
  ArrowRight,
  CheckCircle,
  Users,
  Award
} from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: "Safe & Reliable",
      description: "Professional drivers with verified backgrounds and well-maintained vehicles"
    },
    {
      icon: Clock,
      title: "24/7 Service",
      description: "Round-the-clock availability for your travel needs anytime, anywhere"
    },
    {
      icon: Star,
      title: "Premium Quality",
      description: "Clean, comfortable vehicles with modern amenities for your comfort"
    },
    {
      icon: Users,
      title: "Expert Drivers",
      description: "Experienced drivers who know the city like the back of their hand"
    }
  ]

  const quickServices = [
    {
      title: "Local Taxi",
      description: "Quick rides around Jaipur city",
      icon: Car,
      color: "from-blue-500 to-blue-600",
      link: "/taxi-services"
    },
    {
      title: "Airport Transfer",
      description: "Reliable airport pickup and drop",
      icon: MapPin,
      color: "from-green-500 to-green-600",
      link: "/booking"
    },
    {
      title: "Tour Packages",
      description: "Explore Rajasthan with our packages",
      icon: Globe,
      color: "from-purple-500 to-purple-600",
      link: "/tour-packages"
    }
  ]

  const stats = [
    { number: "5000+", label: "Happy Customers" },
    { number: "100+", label: "Vehicles" },
    { number: "15+", label: "Years Experience" },
    { number: "24/7", label: "Support" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative container-custom section-padding">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 md:space-y-8"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight">
                Your Journey,
                <span className="block text-accent-400">Our Priority</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                Experience premium taxi services and unforgettable tour packages in the Pink City. 
                Professional drivers, clean vehicles, and 24/7 support for all your travel needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link to="/booking" className="btn-primary text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
                  Book Now
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                </Link>
                <Link to="/taxi-services" className="btn-outline text-base md:text-lg px-6 md:px-8 py-3 md:py-4 border-white text-white hover:bg-white hover:text-primary-600">
                  View Services
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                    <Car className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold">Quick Booking</h3>
                  <p className="text-gray-200 text-sm md:text-base">Get instant quotes and book your ride in minutes</p>
                  <div className="bg-white/20 rounded-lg p-3 md:p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>From:</span>
                      <span className="font-semibold">Jaipur</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>To:</span>
                      <span className="font-semibold">Anywhere</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Starting:</span>
                      <span className="font-semibold">₹10/km</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
              Why Choose <span className="text-gradient">Jaipur Taxi</span>?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              We provide reliable, safe, and comfortable transportation services with a focus on customer satisfaction
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Services Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
              Our <span className="text-gradient">Services</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              From local rides to complete tour packages, we have everything you need for your journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {quickServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link to={service.link} className="block">
                  <div className={`bg-gradient-to-br ${service.color} rounded-2xl p-6 md:p-8 text-white group-hover:scale-105 transition-transform duration-300 h-full`}>
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 md:mb-6">
                      <service.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">{service.title}</h3>
                    <p className="text-gray-100 text-sm md:text-base mb-4 md:mb-6">{service.description}</p>
                    <div className="flex items-center text-sm md:text-base font-medium">
                      Learn More
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-r from-secondary-800 to-secondary-900 text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-accent-400 mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <h2 className="text-4xl font-bold font-display">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-100">
              Book your taxi or tour package now and experience the best of Rajasthan with our professional services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
                Book Your Ride
              </Link>
              <a href="tel:+919950000669" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4">
                <Phone className="w-5 h-5 mr-2 inline" />
                Call Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
