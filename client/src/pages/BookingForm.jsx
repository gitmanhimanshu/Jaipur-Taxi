

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Car, Globe, MapPin, Calendar, Clock, Users, Phone, Mail, User, ArrowRight } from 'lucide-react'
import { taxiAPI, toursAPI, bookingsAPI } from '../services/api.js'
import { useNavigate } from 'react-router-dom'

const BookingForm = () => {
  const [bookingType, setBookingType] = useState('taxi')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickupLocation: '',
    dropLocation: '',
    date: '',
    time: '',
    passengers: 1,
    serviceType: '',
    specialRequests: ''
  })
  const [availableServices, setAvailableServices] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchServices()
  }, [bookingType])

  useEffect(() => {
    // Prefill from logged in user
    try {
      const userRaw = localStorage.getItem('user')
      const user = userRaw ? JSON.parse(userRaw) : null
      if (user) {
        setFormData(prev => ({
          ...prev,
          name: prev.name || user.name || '',
          email: prev.email || user.email || '',
          phone: prev.phone || user.phone || ''
        }))
      }
    } catch {}

    // Check for pre-selected service
    const selectedService = localStorage.getItem('selectedService')
    if (selectedService) {
      const service = JSON.parse(selectedService)
      setBookingType(service.type)
      setFormData(prev => ({
        ...prev,
        serviceType: service.id
      }))
      // Clear the selected service after using it
      localStorage.removeItem('selectedService')
    }
  }, [])

  const fetchServices = async () => {
    try {
      if (bookingType === 'taxi') {
        const response = await taxiAPI.getAll()
        if (response.data.success) {
          setAvailableServices(response.data.data)
        }
      } else {
        const response = await toursAPI.getAll()
        if (response.data.success) {
          setAvailableServices(response.data.data)
        }
      }
    } catch (err) {
      console.error('Error fetching services:', err)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const selectedService = availableServices.find(s => String(s._id || s.id) === String(formData.serviceType))
      const bookingData = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        pickupLocation: formData.pickupLocation,
        dropLocation: bookingType === 'taxi' ? formData.dropLocation : (formData.dropLocation || formData.pickupLocation),
        pickupDate: formData.date,
        pickupTime: formData.time,
        serviceType: bookingType,
        serviceId: bookingType === 'tour' ? formData.serviceType : Number(formData.serviceType),
        serviceName: selectedService ? selectedService.name : '',
        passengers: Number(formData.passengers),
        specialRequests: formData.specialRequests
      }

      const response = await bookingsAPI.create(bookingData)
      
      if (response.data.success) {
        setSuccess('Booking submitted successfully! We will contact you soon to confirm.')
        // Remember phone to fetch user's bookings later even if not logged in
        try { localStorage.setItem('booking_phone', formData.phone) } catch {}
        setTimeout(() => navigate('/bookings'), 800)
        setFormData({
          name: '',
          email: '',
          phone: '',
          pickupLocation: '',
          dropLocation: '',
          date: '',
          time: '',
          passengers: 1,
          serviceType: '',
          specialRequests: ''
        })
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit booking. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    return formData.name && formData.email && formData.phone &&
           formData.pickupLocation && formData.date && formData.time && formData.serviceType
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
            Book Your Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto px-4"
          >
            Reserve your taxi ride or tour package with our easy booking system
          </motion.p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12 md:py-16">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card p-6 md:p-8"
          >
            {/* Service Type Selection */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Select Service Type</h2>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setBookingType('taxi')}
                  className={`flex items-center justify-center space-x-2 px-4 md:px-6 py-3 rounded-lg border-2 transition-all duration-200 ${
                    bookingType === 'taxi'
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-gray-300 text-gray-600 hover:border-primary-400 hover:text-primary-600'
                  }`}
                >
                  <Car className="w-5 h-5" />
                  <span>Taxi Service</span>
                </button>
                <button
                  onClick={() => setBookingType('tour')}
                  className={`flex items-center justify-center space-x-2 px-4 md:px-6 py-3 rounded-lg border-2 transition-all duration-200 ${
                    bookingType === 'tour'
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-gray-300 text-gray-600 hover:border-primary-400 hover:text-primary-600'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  <span>Tour Package</span>
                </button>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field pl-10 text-sm md:text-base"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field pl-10 text-sm md:text-base"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field pl-10 text-sm md:text-base"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Passengers
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      id="passengers"
                      name="passengers"
                      value={formData.passengers}
                      onChange={handleChange}
                      className="input-field pl-10 text-sm md:text-base"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Location and Service Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-2">
                    {bookingType === 'taxi' ? 'Pickup Location *' : 'Starting Point *'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="pickupLocation"
                      name="pickupLocation"
                      required
                      value={formData.pickupLocation}
                      onChange={handleChange}
                      className="input-field pl-10 text-sm md:text-base"
                      placeholder={bookingType === 'taxi' ? 'Enter pickup location' : 'Enter starting point'}
                    />
                  </div>
                </div>

                {bookingType === 'taxi' && (
                  <div>
                    <label htmlFor="dropLocation" className="block text-sm font-medium text-gray-700 mb-2">
                      Drop Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="dropLocation"
                        name="dropLocation"
                        required
                        value={formData.dropLocation}
                        onChange={handleChange}
                        className="input-field pl-10 text-sm md:text-base"
                        placeholder="Enter drop location"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="input-field pl-10 text-sm md:text-base"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="time"
                      id="time"
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="input-field pl-10 text-sm md:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                  Select {bookingType === 'taxi' ? 'Taxi Type' : 'Tour Package'} *
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  required
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="input-field text-sm md:text-base"
                >
                  <option value="">Choose a {bookingType === 'taxi' ? 'taxi type' : 'tour package'}</option>
                  {availableServices.map(service => (
                    <option key={service._id || service.id} value={service._id || service.id}>
                      {service.name} - {service.basePrice || service.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Special Requests */}
              <div>
                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows="3"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  className="input-field text-sm md:text-base"
                  placeholder="Any special requirements or requests..."
                />
              </div>

              {/* Error/Success Messages */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <p className="text-green-600 text-sm">{success}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!validateForm() || isLoading}
                  className="btn-primary w-full text-base md:text-lg py-3 md:py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Submit Booking</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
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
              Need Immediate Assistance?
            </h2>
            <p className="text-lg md:text-xl text-gray-200">
              Call us directly for urgent bookings or special requirements
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <a
                href="tel:+919950000669"
                className="btn-primary bg-white text-primary-600 hover:bg-gray-100"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </a>
              <a
                href="mailto:info@jaipurtaxi.com"
                className="btn-outline border-white text-white hover:bg-white hover:text-primary-600"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default BookingForm



