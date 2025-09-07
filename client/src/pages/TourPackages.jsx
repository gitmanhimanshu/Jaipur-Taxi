import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe, MapPin, Clock, Users, Star, ArrowRight, Search, Calendar } from 'lucide-react'
import { toursAPI } from '../services/api.js'

const TourPackages = () => {
  const navigate = useNavigate()
  const [tourPackages, setTourPackages] = useState([])
  const [filteredPackages, setFilteredPackages] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const categories = [
    { id: 'all', name: 'All Tours', icon: Globe },
    { id: 'city', name: 'City Tours', icon: MapPin },
    { id: 'religious', name: 'Religious', icon: Globe },
    { id: 'multi-city', name: 'Multi-City', icon: Globe }
  ]

  useEffect(() => {
    fetchTourPackages()
  }, [])

  useEffect(() => {
    let filtered = tourPackages

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(pkg => pkg.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(pkg => 
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pkg.places && pkg.places.some(place => place.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (pkg.type && pkg.type.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredPackages(filtered)
  }, [selectedCategory, searchQuery, tourPackages])

  const fetchTourPackages = async () => {
    try {
      setIsLoading(true)
      const response = await toursAPI.getAll()
      if (response.data.success) {
        setTourPackages(response.data.data)
      }
    } catch (err) {
      setError('Failed to fetch tour packages')
      console.error('Error fetching tour packages:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookNow = (tour) => {
    // Store tour details for auto-fill
    localStorage.setItem('selectedService', JSON.stringify({
      id: tour._id || tour.id,
      name: tour.name,
      type: 'tour',
      price: tour.price,
      unit: 'package'
    }))
    
    // Navigate to booking form
    navigate('/booking')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tour packages...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Tours</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTourPackages}
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
            Tour Packages
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto px-4"
          >
            Discover the beauty of Rajasthan with our carefully curated tour packages
          </motion.p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-6 md:py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tours, destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
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
        </div>
      </section>

      {/* Tour Packages Grid */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          {filteredPackages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tours Found</h3>
              <p className="text-gray-600">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters.'
                  : 'No tour packages available at the moment.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {filteredPackages.map((tour, index) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card overflow-hidden hover:shadow-strong transition-all duration-300 h-full"
                >
                  {/* Tour Image Placeholder */}
                  <div className="h-40 md:h-48 bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                    <Globe className="w-12 h-12 md:w-16 md:h-16 text-white opacity-80" />
                  </div>
                  
                  <div className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tour.category === 'religious' ? 'bg-amber-100 text-amber-800' :
                        tour.category === 'multi-city' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {tour.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{tour.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm md:text-base">{tour.type}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{tour.places ? tour.places.slice(0, 2).join(', ') : tour.type}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{tour.duration}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="text-lg md:text-2xl font-bold text-primary-600">
                        {tour.price === 'On Request' ? 'On Request' : `₹${tour.price}`}
                        {tour.price !== 'On Request' && <span className="text-sm text-gray-500 font-normal">/person</span>}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button 
                          onClick={() => navigate(`/tour/${tour._id || tour.id}`)}
                          className="btn-outline text-sm px-3 md:px-4 py-2 w-full sm:w-auto"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => handleBookNow(tour)}
                          className="btn-primary text-sm px-3 md:px-4 py-2 w-full sm:w-auto"
                        >
                          Book Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
              Custom Tour Planning
            </h2>
            <p className="text-lg md:text-xl text-gray-200">
              Have a specific destination in mind? Let us create a personalized tour package for you
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Plan Custom Tour
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

export default TourPackages
