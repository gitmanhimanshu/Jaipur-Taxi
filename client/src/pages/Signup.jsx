import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Car, User, Mail, Phone, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { authAPI } from '../services/api.js'

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear errors when user starts typing
    if (error) setError('')
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      })
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }
    
    if (!formData.phone) {
      errors.phone = 'Phone number is required'
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number'
    }
    
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await authAPI.register({
        name: formData.name.trim(),
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      })
      
              if (response.data.success) {
          // Auto-login and redirect to home
          const { token, user } = response.data.data
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))
          
          // Dispatch auth change event to update navbar
          window.dispatchEvent(new Event('authChange'))
          
          setSuccess(`Account created successfully! Welcome ${user.role === 'admin' ? 'Admin' : 'User'}! Redirecting...`)
          
          // Redirect based on user role
          setTimeout(() => {
            if (user.role === 'admin') {
              navigate('/admin')
            } else {
              navigate('/')
            }
          }, 1500)
        }
    } catch (err) {
      if (err.response?.data?.details) {
        // Handle validation errors from server
        const serverErrors = {}
        err.response.data.details.forEach(detail => {
          serverErrors[detail.path] = detail.msg
        })
        setValidationErrors(serverErrors)
      } else {
        setError(err.response?.data?.error || 'Registration failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getFieldError = (fieldName) => {
    return validationErrors[fieldName] || ''
  }

  const hasFieldError = (fieldName) => {
    return !!validationErrors[fieldName]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-6 md:space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto h-16 w-16 md:h-20 md:w-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <Car className="h-8 w-8 md:h-10 md:w-10 text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4 md:mt-6 text-2xl md:text-3xl font-bold text-white font-display"
          >
            Create Account
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-2 text-sm md:text-base text-gray-200"
          >
            Join us for the best taxi services in Jaipur
          </motion.p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 md:space-y-6"
        >
          {/* Error/Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm md:text-base text-red-600">{error}</p>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-sm md:text-base text-green-600">{success}</p>
              </div>
            </motion.div>
          )}

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm md:text-base font-medium text-white mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base ${
                  validationErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {validationErrors.name && (
              <p className="mt-1 text-xs md:text-sm text-red-400">{validationErrors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm md:text-base font-medium text-white mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base ${
                  validationErrors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
            </div>
            {validationErrors.email && (
              <p className="mt-1 text-xs md:text-sm text-red-400">{validationErrors.email}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm md:text-base font-medium text-white mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className={`w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base ${
                  validationErrors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your phone number"
              />
            </div>
            {validationErrors.phone && (
              <p className="mt-1 text-xs md:text-sm text-red-400">{validationErrors.phone}</p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm md:text-base font-medium text-white mb-2">
              Account Type
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base bg-white"
              >
                <option value="user">Regular User</option>
                <option value="admin">Admin User</option>
              </select>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              {formData.role === 'admin' ? 'Admin users can manage services and bookings' : 'Regular users can book services and view their bookings'}
            </p>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm md:text-base font-medium text-white mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 md:pl-12 pr-12 py-3 md:py-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base ${
                  validationErrors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="mt-1 text-xs md:text-sm text-red-400">{validationErrors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm md:text-base font-medium text-white mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 md:pl-12 pr-12 py-3 md:py-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base ${
                  validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-xs md:text-sm text-red-400">{validationErrors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 md:py-4 px-4 border border-transparent rounded-lg shadow-sm text-sm md:text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm md:text-base text-gray-200">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-200 hover:text-white transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  )
}

export default Signup
