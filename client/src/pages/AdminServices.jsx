import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Car, Globe, Save, X } from 'lucide-react'
import { taxiAPI, toursAPI } from '../services/api.js'

const AdminServices = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('taxi')
  const [taxiServices, setTaxiServices] = useState([])
  const [tourServices, setTourServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'km',
    category: 'sedan',
    seats: 4,
    image: '',
    duration: '',
    type: 'city',
    places: [],
    inclusions: []
  })

  useEffect(() => {
    const userRaw = localStorage.getItem('user')
    const user = userRaw ? JSON.parse(userRaw) : null
    if (!user || user.role !== 'admin') {
      navigate('/login', { replace: true, state: { from: { pathname: '/admin/services' } } })
      return
    }
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      setLoading(true)
      const [taxiRes, tourRes] = await Promise.all([
        taxiAPI.getAll(),
        toursAPI.getAll()
      ])
      
      if (taxiRes.data.success) setTaxiServices(taxiRes.data.data)
      if (tourRes.data.success) setTourServices(tourRes.data.data)
    } catch (e) {
      setError('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      unit: activeTab === 'taxi' ? 'km' : 'package',
      category: activeTab === 'taxi' ? 'sedan' : 'city',
      seats: 4,
      image: '',
      duration: '',
      type: 'city',
      places: [],
      inclusions: []
    })
    setShowForm(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price || '',
      unit: item.unit || (activeTab === 'taxi' ? 'km' : 'package'),
      category: item.category || (activeTab === 'taxi' ? 'sedan' : 'city'),
      seats: item.seats || 4,
      image: item.image || '',
      duration: item.duration || '',
      type: item.type || 'city',
      places: item.places || [],
      inclusions: item.inclusions || []
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    try {
      if (activeTab === 'taxi') {
        // Handle taxi service save
        const taxiData = {
          name: formData.name,
          description: formData.description,
          price: parseInt(formData.price),
          unit: formData.unit,
          category: formData.category,
          seats: parseInt(formData.seats),
          image: formData.image
        }
        
        if (editingItem) {
          // Update existing taxi
          await taxiAPI.update(editingItem.id, taxiData)
        } else {
          // Create new taxi
          await taxiAPI.create(taxiData)
        }
      } else {
        // Handle tour service save
        const tourData = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          duration: formData.duration,
          type: formData.type,
          category: formData.category,
          places: formData.places,
          inclusions: formData.inclusions,
          image: formData.image
        }
        
        if (editingItem) {
          // Update existing tour
          await toursAPI.update(editingItem.id, tourData)
        } else {
          // Create new tour
          await toursAPI.create(tourData)
        }
      }
      
      setShowForm(false)
      setEditingItem(null)
      loadServices()
    } catch (e) {
      setError('Failed to save service')
    }
  }

  const handleDelete = async (item) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    try {
      if (activeTab === 'taxi') {
        await taxiAPI.delete(item.id)
      } else {
        await toursAPI.delete(item.id)
      }
      loadServices()
    } catch (e) {
      setError('Failed to delete service')
    }
  }

  if (loading) return <div className="container-custom py-12 md:py-16">Loading...</div>

  return (
    <div className="container-custom py-12 md:py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Manage Services</h1>
        <button
          onClick={handleAddNew}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New {activeTab === 'taxi' ? 'Taxi' : 'Tour'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('taxi')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'taxi'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Car className="w-5 h-5 inline mr-2" />
          Taxi Services
        </button>
        <button
          onClick={() => setActiveTab('tour')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'tour'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Globe className="w-5 h-5 inline mr-2" />
          Tour Packages
        </button>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(activeTab === 'taxi' ? taxiServices : tourServices).map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{service.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(service)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Price:</strong> ₹{service.price}/{service.unit}</p>
              {activeTab === 'taxi' ? (
                <>
                  <p><strong>Seats:</strong> {service.seats}</p>
                  <p><strong>Category:</strong> {service.category}</p>
                </>
              ) : (
                <>
                  <p><strong>Duration:</strong> {service.duration}</p>
                  <p><strong>Type:</strong> {service.type}</p>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingItem ? 'Edit' : 'Add New'} {activeTab === 'taxi' ? 'Taxi Service' : 'Tour Package'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input-field"
                    placeholder="Service name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Price *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="input-field"
                    placeholder="Price"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input-field"
                  rows="3"
                  placeholder="Service description"
                />
              </div>

              {activeTab === 'taxi' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Seats</label>
                    <input
                      type="number"
                      value={formData.seats}
                      onChange={(e) => setFormData({...formData, seats: e.target.value})}
                      className="input-field"
                      min="1"
                      max="50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="input-field"
                    >
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="mpv">MPV</option>
                      <option value="bus">Bus</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Unit</label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      className="input-field"
                    >
                      <option value="km">Per KM</option>
                      <option value="hour">Per Hour</option>
                      <option value="day">Per Day</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="input-field"
                      placeholder="e.g., 2 days, 1 night"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="input-field"
                    >
                      <option value="city">City Tour</option>
                      <option value="religious">Religious</option>
                      <option value="multi-city">Multi-City</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="input-field"
                  placeholder="Image URL"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminServices

