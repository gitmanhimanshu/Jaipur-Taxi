import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookingsAPI } from '../services/api.js'
import { CheckCircle, XCircle, Clock, Users, DollarSign, Calendar, Settings, Car } from 'lucide-react'

const Admin = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    totalRevenue: 0
  })
  const [adminCreatedBookings, setAdminCreatedBookings] = useState([])
  const [showAdminBookings, setShowAdminBookings] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      const [allBookingsRes, adminBookingsRes] = await Promise.all([
        bookingsAPI.getAll(),
        bookingsAPI.getAdminCreated()
      ])
      
      if (allBookingsRes.data.success) {
        setBookings(allBookingsRes.data.data)
        calculateStats(allBookingsRes.data.data)
      }
      
      if (adminBookingsRes.data.success) {
        setAdminCreatedBookings(adminBookingsRes.data.data)
      }
    } catch (e) {
      setError('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (bookingsData) => {
    const stats = {
      total: bookingsData.length,
      pending: bookingsData.filter(b => b.status === 'pending').length,
      confirmed: bookingsData.filter(b => b.status === 'confirmed').length,
      cancelled: bookingsData.filter(b => b.status === 'cancelled').length,
      totalRevenue: bookingsData.reduce((sum, b) => sum + (parseInt(b.totalAmount) || 0), 0)
    }
    setStats(stats)
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await bookingsAPI.update(bookingId, { status: newStatus })
      setBookings(prev => prev.map(b => 
        b._id === bookingId ? { ...b, status: newStatus } : b
      ))
      // Recalculate stats
      const updatedBookings = bookings.map(b => 
        b._id === bookingId ? { ...b, status: newStatus } : b
      )
      calculateStats(updatedBookings)
    } catch (e) {
      setError('Failed to update booking status')
    }
  }

  useEffect(() => {
    const userRaw = localStorage.getItem('user')
    const user = userRaw ? JSON.parse(userRaw) : null
    if (!user || user.role !== 'admin') {
      navigate('/login', { replace: true, state: { from: { pathname: '/admin' } } })
      return
    }
    load()
  }, [])

  if (loading) return <div className="container-custom py-12 md:py-16">Loading...</div>
  if (error) return <div className="container-custom py-12 md:py-16 text-red-600">{error}</div>

  return (
    <div className="container-custom py-12 md:py-16">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/admin/tour-management')}
            className="btn-outline flex items-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Manage Tours</span>
          </button>
          <button
            onClick={() => navigate('/admin/tour-bookings')}
            className="btn-outline flex items-center space-x-2"
          >
            <Users className="w-5 h-5" />
            <span>Tour Bookings</span>
          </button>
          <button
            onClick={() => navigate('/admin/taxi-management')}
            className="btn-outline flex items-center space-x-2"
          >
            <Car className="w-5 h-5" />
            <span>Manage Taxis</span>
          </button>
          <button
            onClick={() => navigate('/admin/taxi-bookings')}
            className="btn-outline flex items-center space-x-2"
          >
            <Users className="w-5 h-5" />
            <span>Taxi Bookings</span>
          </button>
          <button
            onClick={() => navigate('/admin/services')}
            className="btn-primary flex items-center space-x-2"
          >
            <Settings className="w-5 h-5" />
            <span>Manage Services</span>
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="card p-4 text-center">
          <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Total Bookings</div>
        </div>
        <div className="card p-4 text-center">
          <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="card p-4 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.confirmed}</div>
          <div className="text-sm text-gray-500">Confirmed</div>
        </div>
        <div className="card p-4 text-center">
          <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.cancelled}</div>
          <div className="text-sm text-gray-500">Cancelled</div>
        </div>
        <div className="card p-4 text-center">
          <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue}</div>
          <div className="text-sm text-gray-500">Revenue</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold">
          {showAdminBookings ? 'My Created Bookings' : 'All Bookings'}
        </h2>
        <button
          onClick={() => setShowAdminBookings(!showAdminBookings)}
          className="btn-outline"
        >
          {showAdminBookings ? 'Show All Bookings' : 'Show My Bookings'}
        </button>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto bg-white rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">Booking #</th>
              <th className="text-left px-4 py-3">Customer</th>
              <th className="text-left px-4 py-3">Service</th>
              <th className="text-left px-4 py-3">Pickup</th>
              <th className="text-left px-4 py-3">When</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(showAdminBookings ? adminCreatedBookings : bookings).map(b => (
              <tr key={b._id} className="border-t">
                <td className="px-4 py-3 font-mono">{b.bookingNumber}</td>
                <td className="px-4 py-3">{b.customerName}<div className="text-gray-500">{b.customerPhone}</div></td>
                <td className="px-4 py-3">{b.serviceName} <span className="text-gray-500">({b.serviceType})</span></td>
                <td className="px-4 py-3">{b.pickupLocation} → {b.dropLocation}</td>
                <td className="px-4 py-3">{b.pickupDate} {b.pickupTime}</td>
                <td className="px-4 py-3">₹{b.totalAmount}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    b.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    b.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {b.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateBookingStatus(b._id, 'confirmed')}
                        className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateBookingStatus(b._id, 'cancelled')}
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {(showAdminBookings ? adminCreatedBookings : bookings).map(b => (
          <div key={b._id} className="card p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="font-mono text-sm text-gray-500">{b.bookingNumber}</div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                b.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                b.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div>
                <span className="font-medium text-sm">Customer:</span>
                <div className="text-gray-700">{b.customerName}</div>
                <div className="text-gray-500 text-sm">{b.customerPhone}</div>
              </div>
              
              <div>
                <span className="font-medium text-sm">Service:</span>
                <div className="text-gray-700">{b.serviceName} <span className="text-gray-500">({b.serviceType})</span></div>
              </div>
              
              <div>
                <span className="font-medium text-sm">Route:</span>
                <div className="text-gray-700">{b.pickupLocation} → {b.dropLocation}</div>
              </div>
              
              <div>
                <span className="font-medium text-sm">Date & Time:</span>
                <div className="text-gray-700">{b.pickupDate} {b.pickupTime}</div>
              </div>
              
              <div>
                <span className="font-medium text-sm">Amount:</span>
                <div className="text-gray-700">₹{b.totalAmount}</div>
              </div>
            </div>

            {b.status === 'pending' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => updateBookingStatus(b._id, 'confirmed')}
                  className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => updateBookingStatus(b._id, 'cancelled')}
                  className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Admin


