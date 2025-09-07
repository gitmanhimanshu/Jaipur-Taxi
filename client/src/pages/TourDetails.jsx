import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe, MapPin, Clock, Users, Star, ArrowRight, Calendar, CheckCircle } from 'lucide-react'
import { toursAPI } from '../services/api.js'

const TourDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tour, setTour] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTourDetails()
  }, [id])

  const fetchTourDetails = async () => {
    try {
      setIsLoading(true)
      const response = await toursAPI.getById(id)
      if (response.data.success) {
        setTour(response.data.data)
      }
    } catch (err) {
      setError('Failed to fetch tour details')
      console.error('Error fetching tour details:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookNow = () => {
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
          <p className="text-gray-600">Loading tour details...</p>
        </div>
      </div>
    )
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tour Not Found</h3>
          <p className="text-gray-600 mb-4">{error || 'The tour you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/tour-packages')}
            className="btn-primary"
          >
            Back to Tours
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-12 md:py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4">
              {tour.name}
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto px-4">
              {tour.type} • {tour.duration}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tour Details */}
      <section className="py-12 md:py-16">
        <div className="container-custom max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tour Image */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="card overflow-hidden"
              >
                <div className="h-64 md:h-80 bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                  <Globe className="w-20 h-20 text-white opacity-80" />
                </div>
              </motion.div>

              {/* Tour Information */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="card p-6 md:p-8"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Tour Overview</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <span className="text-gray-700"><strong>Duration:</strong> {tour.duration}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <span className="text-gray-700"><strong>Type:</strong> {tour.type}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <span className="text-gray-700"><strong>Category:</strong> {tour.category}</span>
                  </div>
                </div>
              </motion.div>

              {/* Places to Visit */}
              {tour.places && tour.places.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="card p-6 md:p-8"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Places to Visit</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tour.places.map((place, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{place}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Inclusions */}
              {tour.inclusions && tour.inclusions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="card p-6 md:p-8"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">What's Included</h3>
                  <div className="space-y-3">
                    {tour.inclusions.map((inclusion, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{inclusion}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="card p-6 md:p-8 sticky top-8"
              >
                <div className="text-center mb-6">
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                    {tour.price === 'On Request' ? 'On Request' : `₹${tour.price}`}
                  </div>
                  {tour.price !== 'On Request' && (
                    <div className="text-gray-500">per person</div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{tour.duration}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium">{tour.type}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium capitalize">{tour.category}</span>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  className="btn-primary w-full text-lg py-4"
                >
                  Book This Tour
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">Need help?</p>
                  <a
                    href="tel:+919950000669"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Call +91-99500-00669
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TourDetails

