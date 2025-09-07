import { useEffect, useState } from 'react'
import { bookingsAPI } from '../services/api.js'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const userRaw = localStorage.getItem('user')
    const user = userRaw ? JSON.parse(userRaw) : null
    const phone = user?.phone || localStorage.getItem('booking_phone')
    if (!phone) { setError('No phone found. Please login or make a booking.'); setLoading(false); return }
    load(phone)
  }, [])

  const load = async (phone) => {
    try {
      setLoading(true)
      const res = await bookingsAPI.getByCustomer(phone)
      if (res.data.success) setBookings(res.data.data)
    } catch (e) {
      setError('Failed to load your bookings')
    } finally {
      setLoading(false)
    }
  }

  const onCancel = async (id) => {
    try {
      const userRaw = localStorage.getItem('user')
      const user = userRaw ? JSON.parse(userRaw) : null
      const phone = user?.phone || localStorage.getItem('booking_phone')
      await bookingsAPI.cancel(id, phone)
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b))
    } catch (e) {
      setError('Unable to cancel booking')
    }
  }

  if (loading) return <div className="container-custom py-12 md:py-16">Loading...</div>
  if (error) return <div className="container-custom py-12 md:py-16 text-red-600">{error}</div>

  return (
    <div className="container-custom py-12 md:py-16">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="text-gray-600 text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">No bookings yet</p>
          <p className="text-gray-600">Start by making your first booking!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {bookings.map(b => (
            <div key={b._id} className="card p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4">
                <div className="font-semibold text-base md:text-lg mb-1 sm:mb-0">
                  {b.serviceName} 
                  <span className="text-gray-500 text-sm md:text-base"> ({b.serviceType})</span>
                </div>
                <div className="text-xs md:text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                  {b.bookingNumber}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="text-gray-700 text-sm md:text-base">
                  <span className="font-medium">Route:</span> {b.pickupLocation} → {b.dropLocation}
                </div>
                <div className="text-gray-700 text-sm md:text-base">
                  <span className="font-medium">Date & Time:</span> {b.pickupDate} {b.pickupTime}
                </div>
                <div className="text-gray-700 text-sm md:text-base">
                  <span className="font-medium">Customer:</span> {b.customerName}
                </div>
                <div className="text-gray-700 text-sm md:text-base">
                  <span className="font-medium">Phone:</span> {b.customerPhone}
                </div>
                {b.totalAmount && (
                  <div className="text-gray-700 text-sm md:text-base">
                    <span className="font-medium">Amount:</span> ₹{b.totalAmount}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-sm md:text-base">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    b.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    b.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                </div>
                {b.status === 'pending' && (
                  <button 
                    onClick={() => onCancel(b._id)} 
                    className="text-sm md:text-base px-3 md:px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 w-full sm:w-auto"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookings
