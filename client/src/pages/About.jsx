import { motion } from 'framer-motion'
import { Car, Globe, Shield, Clock, Star, Users, Award, MapPin, Phone, Mail } from 'lucide-react'

const About = () => {
  const stats = [
    { number: "5000+", label: "Happy Customers", icon: Users },
    { number: "100+", label: "Vehicles", icon: Car },
    { number: "15+", label: "Years Experience", icon: Award },
    { number: "24/7", label: "Support", icon: Clock }
  ]

  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description: "Your safety is our top priority. All our vehicles are regularly maintained and drivers are thoroughly vetted."
    },
    {
      icon: Star,
      title: "Quality Service",
      description: "We maintain the highest standards of service quality to ensure your complete satisfaction."
    },
    {
      icon: Clock,
      title: "Reliability",
      description: "Count on us to be there when you need us, with punctual and dependable service."
    },
    {
      icon: Users,
      title: "Customer Focus",
      description: "We put our customers first, always striving to exceed expectations and build lasting relationships."
    }
  ]

  const team = [
    {
      name: "Rajesh Kumar",
      position: "Founder & CEO",
      description: "With over 20 years in the transportation industry, Rajesh leads our company with vision and expertise."
    },
    {
      name: "Priya Sharma",
      position: "Operations Manager",
      description: "Priya ensures smooth operations and maintains our high service standards across all locations."
    },
    {
      name: "Amit Patel",
      position: "Fleet Manager",
      description: "Amit manages our vehicle fleet, ensuring all cars are well-maintained and road-ready."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-20">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-5xl font-bold font-display mb-4"
          >
            About Jaipur Taxi
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-100 max-w-3xl mx-auto"
          >
            Your trusted partner for premium transportation services in the Pink City and beyond
          </motion.p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-display">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2008, Jaipur Taxi began as a small family business with a simple mission: to provide reliable, 
                  comfortable, and affordable transportation services to visitors and residents of Jaipur.
                </p>
                <p>
                  What started with just a few vehicles has grown into one of the most trusted names in the region's 
                  transportation industry. Over the years, we've expanded our services to include not just local taxi rides, 
                  but also comprehensive tour packages across Rajasthan.
                </p>
                <p>
                  Our commitment to quality, safety, and customer satisfaction has remained unchanged, making us the 
                  preferred choice for thousands of customers who choose us year after year.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-400 to-accent-500 rounded-2xl p-8 text-white text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2">15+ Years of Excellence</h3>
                <p className="text-gray-100">
                  Serving the Pink City with dedication and professionalism since 2008
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-100">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and every service we provide
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The dedicated professionals behind our success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-semibold mb-3">{member.position}</p>
                <p className="text-gray-600">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-secondary-800 to-secondary-900 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-3xl font-bold font-display">
              Ready to Experience Our Service?
            </h2>
            <p className="text-xl text-gray-200">
              Get in touch with us today to book your ride or plan your perfect tour
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="btn-primary bg-white text-primary-600 hover:bg-gray-100"
              >
                Contact Us
              </a>
              <a
                href="/booking"
                className="btn-outline border-white text-white hover:bg-white hover:text-primary-600"
              >
                Book Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About



