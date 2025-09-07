import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ToggleLeft, 
  ToggleRight,
  Search,
  Filter,
  Globe,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Calendar,
  Tag
} from 'lucide-react'
import { toursAPI } from '../services/api.js'

const AdminTourManagement = () => {
  const [tours, setTours] = useState([])
  const [filteredTours, setFilteredTours] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTour, setSelectedTour] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '1 Day Tour',
    duration: '',
    price: '',
    originalPrice: '',
    discount: '',
    category: 'city',
    image: '',
    features: ['Sightseeing', 'Transfers', 'Driver', 'Fuel', 'Water'],
    inclusions: [],
    places: [],
    customizable: true,
    maxCapacity: 50,
    minCapacity: 1,
    tags: []
  })

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'religious', label: 'Religious' },
    { value: 'city', label: 'City Tours' },
    { value: 'multi-city', label: 'Multi-City' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'wildlife', label: 'Wildlife' }
  ]

  const tourTypes = [
    '1 Day Tour',
    '2 Days / 1 Night',
    '3 Days / 2 Nights',
    '4 Nights / 5 Days',
    '6 Nights / 7 Days',
    '7 Nights / 8 Days',
    '8 Night / 9 Days',
    '9 Nights / 10 Days',
    'Custom'
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]

  useEffect(() => {
    fetchTours()
  }, [])

  useEffect(() => {
    let filtered = tours

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(tour => 
        tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.places.some(place => place.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(tour => tour.category === categoryFilter)
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tour => 
        statusFilter === 'active' ? tour.isActive : !tour.isActive
      )
    }

    setFilteredTours(filtered)
  }, [searchQuery, categoryFilter, statusFilter, tours])

  const fetchTours = async () => {
    try {
      setIsLoading(true)
      const response = await toursAPI.getAdminTours()
      if (response.data.success) {
        setTours(response.data.data)
      }
    } catch (err) {
      setError('Failed to fetch tours')
      console.error('Error fetching tours:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTour = async (e) => {
    e.preventDefault()
    try {
      const response = await toursAPI.create(formData)
      if (response.data.success) {
        setTours([response.data.data, ...tours])
        setShowCreateModal(false)
        resetForm()
      }
    } catch (err) {
      console.error('Error creating tour:', err)
    }
  }

  const handleUpdateTour = async (e) => {
    e.preventDefault()
    try {
      const response = await toursAPI.update(selectedTour._id, formData)
      if (response.data.success) {
        setTours(tours.map(tour => 
          tour._id === selectedTour._id ? response.data.data : tour
        ))
        setShowEditModal(false)
        setSelectedTour(null)
        resetForm()
      }
    } catch (err) {
      console.error('Error updating tour:', err)
    }
  }

  const handleDeleteTour = async (tourId) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      try {
        const response = await toursAPI.delete(tourId)
        if (response.data.success) {
          setTours(tours.filter(tour => tour._id !== tourId))
        }
      } catch (err) {
        console.error('Error deleting tour:', err)
      }
    }
  }

  const handleToggleStatus = async (tourId) => {
    try {
      const response = await toursAPI.toggleStatus(tourId)
      if (response.data.success) {
        setTours(tours.map(tour => 
          tour._id === tourId ? response.data.data : tour
        ))
      }
    } catch (err) {
      console.error('Error toggling tour status:', err)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: '1 Day Tour',
      duration: '',
      price: '',
      originalPrice: '',
      discount: '',
      category: 'city',
      image: '',
      features: ['Sightseeing', 'Transfers', 'Driver', 'Fuel', 'Water'],
      inclusions: [],
      places: [],
      customizable: true,
      maxCapacity: 50,
      minCapacity: 1,
      tags: []
    })
  }

  const openEditModal = (tour) => {
    setSelectedTour(tour)
    setFormData({
      name: tour.name,
      description: tour.description,
      type: tour.type,
      duration: tour.duration,
      price: tour.price,
      originalPrice: tour.originalPrice || '',
      discount: tour.discount || '',
      category: tour.category,
      image: tour.image,
      features: tour.features,
      inclusions: tour.inclusions,
      places: tour.places,
      customizable: tour.customizable,
      maxCapacity: tour.maxCapacity,
      minCapacity: tour.minCapacity,
      tags: tour.tags
    })
    setShowEditModal(true)
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'religious': return 'bg-amber-100 text-amber-800'
      case 'city': return 'bg-blue-100 text-blue-800'
      case 'multi-city': return 'bg-green-100 text-green-800'
      case 'adventure': return 'bg-red-100 text-red-800'
      case 'cultural': return 'bg-purple-100 text-purple-800'
      case 'wildlife': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tour Management</h1>
              <p className="text-gray-600 mt-1">Create and manage your tour packages</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Tour
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tours List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredTours.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tours Found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Create your first tour package to get started.'
              }
            </p>
            {!searchQuery && categoryFilter === 'all' && statusFilter === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                Create Tour
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour, index) => (
              <motion.div
                key={tour._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(tour.category)}`}>
                          {tour.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tour.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {tour.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{tour.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{tour.type}</p>
                    </div>
                    <button
                      onClick={() => handleToggleStatus(tour._id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {tour.isActive ? (
                        <ToggleRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>{tour.price}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{tour.places.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Created: {new Date(tour.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(tour)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTour(tour._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Tour Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {showCreateModal ? 'Create New Tour' : 'Edit Tour'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setShowEditModal(false)
                    setSelectedTour(null)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={showCreateModal ? handleCreateTour : handleUpdateTour} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tour Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tour Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {tourTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="e.g., 9 AM - 6 PM"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {categories.filter(cat => cat.value !== 'all').map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="e.g., 999 or On Request"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Places to Visit (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.places.join('\n')}
                    onChange={(e) => setFormData({...formData, places: e.target.value.split('\n').filter(p => p.trim())})}
                    placeholder="Amer Fort&#10;City Palace&#10;Hawa Mahal"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inclusions (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.inclusions.join('\n')}
                    onChange={(e) => setFormData({...formData, inclusions: e.target.value.split('\n').filter(i => i.trim())})}
                    placeholder="Transportation in AC Taxi&#10;Driver Allowance & Fuel&#10;Professional Guide"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      setShowEditModal(false)
                      setSelectedTour(null)
                      resetForm()
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {showCreateModal ? 'Create Tour' : 'Update Tour'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminTourManagement

