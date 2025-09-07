import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, MapPin, Clock, Users, Star, ArrowRight, Filter } from 'lucide-react'
import { taxiAPI } from '../services/api.js'

const TaxiServices = () => {
  const navigate = useNavigate()
  const [taxiServices, setTaxiServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const categories = [
    { id: 'all', name: 'All Services', icon: Car },
    { id: 'city', name: 'City', icon: Car },
    { id: 'outstation', name: 'Outstation', icon: Car },
    { id: 'airport', name: 'Airport', icon: Car },
    { id: 'railway', name: 'Railway', icon: Car },
    { id: 'local', name: 'Local', icon: Car },
    { id: 'intercity', name: 'Intercity', icon: Car }
  ]

  useEffect(() => {
    fetchTaxiServices()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredServices(taxiServices)
    } else {
      setFilteredServices(taxiServices.filter(service => service.category === selectedCategory))
    }
  }, [selectedCategory, taxiServices])

  const fetchTaxiServices = async () => {
    try {
      setIsLoading(true)
      const response = await taxiAPI.getAll()
      if (response.data.success) {
        setTaxiServices(response.data.data)
      }
    } catch (err) {
      setError('Failed to fetch taxi services')
      console.error('Error fetching taxi services:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookNow = (service) => {
    // Store service details for auto-fill
    localStorage.setItem('selectedService', JSON.stringify({
      id: service._id,
      name: service.name,
      type: 'taxi',
      price: service.pricePerKm,
      unit: 'per km',
      category: service.category,
      seats: service.capacity
    }))
    
    // Navigate to booking form
    navigate('/booking')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading taxi services...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Services</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTaxiServices}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-12 md:py-20">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4"
          >
            Our Taxi Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto px-4"
          >
            Choose from our wide range of comfortable and reliable taxi services for all your travel needs
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-6 md:py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-full border-2 transition-all duration-200 whitespace-nowrap text-sm md:text-base ${
                  selectedCategory === category.id
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-gray-300 text-gray-600 hover:border-primary-400 hover:text-primary-600'
                }`}
              >
                <category.icon className="w-3 h-3 md:w-4 md:h-4" />
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card overflow-hidden hover:shadow-strong transition-all duration-300 h-full"
              >
                {/* Service Image */}
                <div className="h-48 bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                  <Car className="w-16 h-16 text-white opacity-80" />
                </div>
                
                <div className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      service.category === 'city' ? 'bg-blue-100 text-blue-800' :
                      service.category === 'outstation' ? 'bg-green-100 text-green-800' :
                      service.category === 'airport' ? 'bg-purple-100 text-purple-800' :
                      service.category === 'railway' ? 'bg-orange-100 text-orange-800' :
                      service.category === 'local' ? 'bg-pink-100 text-pink-800' :
                      service.category === 'intercity' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {service.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm md:text-base">{service.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{service.capacity} Seats</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Car className="w-4 h-4 mr-2" />
                      <span>{service.type}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="text-lg md:text-2xl font-bold text-primary-600">
                      ₹{service.pricePerKm}
                      <span className="text-sm text-gray-500 font-normal">/km</span>
                    </div>
                    <button 
                      onClick={() => handleBookNow(service)}
                      className="btn-primary text-sm px-3 md:px-4 py-2 w-full sm:w-auto"
                    >
                      Book Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-secondary-800 to-secondary-900 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-6 px-4"
          >
            <h2 className="text-2xl md:text-3xl font-bold font-display">
              Need a Custom Quote?
            </h2>
            <p className="text-lg md:text-xl text-gray-200">
              Contact us for special requirements or bulk bookings
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Get Quote
              </button>
              <button className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default TaxiServices




