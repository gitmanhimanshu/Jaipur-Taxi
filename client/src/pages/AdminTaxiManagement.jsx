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
  Car,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Calendar,
  Tag,
  Fuel,
  Settings
} from 'lucide-react'
import { taxiAPI } from '../services/api.js'

const AdminTaxiManagement = () => {
  const [taxis, setTaxis] = useState([])
  const [filteredTaxis, setFilteredTaxis] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTaxi, setSelectedTaxi] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Sedan',
    category: 'city',
    basePrice: 0,
    pricePerKm: 10,
    pricePerHour: 0,
    minimumFare: 0,
    capacity: 4,
    features: ['Driver', 'Fuel', 'Water', 'Parking', 'Toll-Tax'],
    image: '',
    availableAreas: [],
    fuelType: 'Petrol',
    transmission: 'Manual',
    ac: true,
    driverIncluded: true,
    tags: []
  })

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'city', label: 'City' },
    { value: 'outstation', label: 'Outstation' },
    { value: 'airport', label: 'Airport' },
    { value: 'railway', label: 'Railway' },
    { value: 'local', label: 'Local' },
    { value: 'intercity', label: 'Intercity' }
  ]

  const taxiTypes = [
    'Sedan',
    'SUV',
    'Hatchback',
    'Luxury',
    'Mini Bus',
    'Bus',
    'Tempo Traveller'
  ]

  const fuelTypes = [
    'Petrol',
    'Diesel',
    'CNG',
    'Electric',
    'Hybrid'
  ]

  const transmissions = [
    'Manual',
    'Automatic'
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]

  useEffect(() => {
    fetchTaxis()
  }, [])

  useEffect(() => {
    let filtered = taxis

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(taxi => 
        taxi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        taxi.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        taxi.availableAreas.some(area => area.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(taxi => taxi.category === categoryFilter)
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(taxi => 
        statusFilter === 'active' ? taxi.isActive : !taxi.isActive
      )
    }

    setFilteredTaxis(filtered)
  }, [searchQuery, categoryFilter, statusFilter, taxis])

  const fetchTaxis = async () => {
    try {
      setIsLoading(true)
      const response = await taxiAPI.getAdminTaxis()
      if (response.data.success) {
        setTaxis(response.data.data)
      }
    } catch (err) {
      setError('Failed to fetch taxi services')
      console.error('Error fetching taxi services:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTaxi = async (e) => {
    e.preventDefault()
    try {
      const response = await taxiAPI.create(formData)
      if (response.data.success) {
        setTaxis([response.data.data, ...taxis])
        setShowCreateModal(false)
        resetForm()
      }
    } catch (err) {
      console.error('Error creating taxi service:', err)
    }
  }

  const handleUpdateTaxi = async (e) => {
    e.preventDefault()
    try {
      const response = await taxiAPI.update(selectedTaxi._id, formData)
      if (response.data.success) {
        setTaxis(taxis.map(taxi => 
          taxi._id === selectedTaxi._id ? response.data.data : taxi
        ))
        setShowEditModal(false)
        setSelectedTaxi(null)
        resetForm()
      }
    } catch (err) {
      console.error('Error updating taxi service:', err)
    }
  }

  const handleDeleteTaxi = async (taxiId) => {
    if (window.confirm('Are you sure you want to delete this taxi service?')) {
      try {
        const response = await taxiAPI.delete(taxiId)
        if (response.data.success) {
          setTaxis(taxis.filter(taxi => taxi._id !== taxiId))
        }
      } catch (err) {
        console.error('Error deleting taxi service:', err)
      }
    }
  }

  const handleToggleStatus = async (taxiId) => {
    try {
      const response = await taxiAPI.toggleStatus(taxiId)
      if (response.data.success) {
        setTaxis(taxis.map(taxi => 
          taxi._id === taxiId ? response.data.data : taxi
        ))
      }
    } catch (err) {
      console.error('Error toggling taxi status:', err)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'Sedan',
      category: 'city',
      basePrice: 0,
      pricePerKm: 10,
      pricePerHour: 0,
      minimumFare: 0,
      capacity: 4,
      features: ['Driver', 'Fuel', 'Water', 'Parking', 'Toll-Tax'],
      image: '',
      availableAreas: [],
      fuelType: 'Petrol',
      transmission: 'Manual',
      ac: true,
      driverIncluded: true,
      tags: []
    })
  }

  const openEditModal = (taxi) => {
    setSelectedTaxi(taxi)
    setFormData({
      name: taxi.name,
      description: taxi.description,
      type: taxi.type,
      category: taxi.category,
      basePrice: taxi.basePrice,
      pricePerKm: taxi.pricePerKm,
      pricePerHour: taxi.pricePerHour,
      minimumFare: taxi.minimumFare,
      capacity: taxi.capacity,
      features: taxi.features,
      image: taxi.image,
      availableAreas: taxi.availableAreas,
      fuelType: taxi.fuelType,
      transmission: taxi.transmission,
      ac: taxi.ac,
      driverIncluded: taxi.driverIncluded,
      tags: taxi.tags
    })
    setShowEditModal(true)
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'city': return 'bg-blue-100 text-blue-800'
      case 'outstation': return 'bg-green-100 text-green-800'
      case 'airport': return 'bg-purple-100 text-purple-800'
      case 'railway': return 'bg-orange-100 text-orange-800'
      case 'local': return 'bg-pink-100 text-pink-800'
      case 'intercity': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Taxi Management</h1>
              <p className="text-gray-600 mt-1">Create and manage your taxi services</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Taxi Service
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
                placeholder="Search taxi services..."
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

      {/* Taxi Services List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredTaxis.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Taxi Services Found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Create your first taxi service to get started.'
              }
            </p>
            {!searchQuery && categoryFilter === 'all' && statusFilter === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                Add Taxi Service
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTaxis.map((taxi, index) => (
              <motion.div
                key={taxi._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(taxi.category)}`}>
                          {taxi.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          taxi.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {taxi.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{taxi.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{taxi.type}</p>
                    </div>
                    <button
                      onClick={() => handleToggleStatus(taxi._id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {taxi.isActive ? (
                        <ToggleRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>₹{taxi.pricePerKm}/km</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{taxi.capacity} passengers</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Fuel className="w-4 h-4 mr-2" />
                      <span>{taxi.fuelType}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Created: {new Date(taxi.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(taxi)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTaxi(taxi._id)}
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

      {/* Create/Edit Taxi Modal */}
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
                  {showCreateModal ? 'Add New Taxi Service' : 'Edit Taxi Service'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setShowEditModal(false)
                    setSelectedTaxi(null)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={showCreateModal ? handleCreateTaxi : handleUpdateTaxi} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taxi Name *
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
                      Taxi Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {taxiTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
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
                      Passenger Capacity *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="50"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per KM *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.pricePerKm}
                      onChange={(e) => setFormData({...formData, pricePerKm: parseFloat(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Hour
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.pricePerHour}
                      onChange={(e) => setFormData({...formData, pricePerHour: parseFloat(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Fare
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.minimumFare}
                      onChange={(e) => setFormData({...formData, minimumFare: parseFloat(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuel Type
                    </label>
                    <select
                      value={formData.fuelType}
                      onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {fuelTypes.map(fuel => (
                        <option key={fuel} value={fuel}>{fuel}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transmission
                    </label>
                    <select
                      value={formData.transmission}
                      onChange={(e) => setFormData({...formData, transmission: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {transmissions.map(trans => (
                        <option key={trans} value={trans}>{trans}</option>
                      ))}
                    </select>
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
                    Available Areas (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.availableAreas.join('\n')}
                    onChange={(e) => setFormData({...formData, availableAreas: e.target.value.split('\n').filter(area => area.trim())})}
                    placeholder="Jaipur&#10;Delhi&#10;Mumbai"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.features.join('\n')}
                    onChange={(e) => setFormData({...formData, features: e.target.value.split('\n').filter(feature => feature.trim())})}
                    placeholder="Driver&#10;Fuel&#10;Water&#10;Parking&#10;Toll-Tax"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.ac}
                      onChange={(e) => setFormData({...formData, ac: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">AC Available</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.driverIncluded}
                      onChange={(e) => setFormData({...formData, driverIncluded: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Driver Included</span>
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      setShowEditModal(false)
                      setSelectedTaxi(null)
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
                    {showCreateModal ? 'Add Taxi Service' : 'Update Taxi Service'}
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

export default AdminTaxiManagement


