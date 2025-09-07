import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Phone, MapPin, Car, Globe, User, LogOut, Settings } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    // Check if user is logged in
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      if (token && userData) {
        setUser(JSON.parse(userData))
      } else {
        setUser(null)
      }
    }

    // Initial check
    checkAuth()

    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth()
      }
    }

    // Listen for custom auth events (login/logout from same tab)
    const handleAuthChange = () => {
      checkAuth()
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('authChange', handleAuthChange)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authChange', handleAuthChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setShowUserMenu(false)
    // Dispatch auth change event
    window.dispatchEvent(new Event('authChange'))
    navigate('/')
  }

  const navLinks = [
    { name: 'Home', path: '/', icon: null },
    { name: 'Taxi Services', path: '/taxi-services', icon: Car },
    { name: 'Tour Packages', path: '/tour-packages', icon: Globe },
    { name: 'Book Now', path: '/booking', icon: null, hideForAdmin: true },
    { name: 'Create Booking', path: '/admin', icon: null, showForAdmin: true },
    { name: 'About', path: '/about', icon: null },
    { name: 'Contact', path: '/contact', icon: null },
  ]

  // Filter navigation links based on user role
  const filteredNavLinks = navLinks.filter(link => {
    // Hide links marked for admin hiding
    if (user && user.role === 'admin' && link.hideForAdmin) {
      return false
    }
    // Show admin-only links only for admins
    if (link.showForAdmin && (!user || user.role !== 'admin')) {
      return false
    }
    return true
  })

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <Car className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-lg md:text-xl font-bold text-gradient font-display">
            Eg Run Cab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {filteredNavLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm lg:text-base ${
                    isActive(link.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Right Side - Contact Info & Auth */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Contact Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-primary-600" />
                <span>+91-99500-00669</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-primary-600" />
                <span>Jaipur, Rajasthan</span>
              </div>
            </div>

            {/* Auth Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200"
                >
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      {user.role === 'admin' && (
                        <p className="text-xs text-primary-600 font-medium">Admin</p>
                      )}
                    </div>
                    {user.role === 'admin' ? (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/bookings"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Car className="w-4 h-4" />
                          <span>My Bookings</span>
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-4 py-2 font-medium transition-colors duration-200 ${user ? 'hidden' : 'text-primary-600 hover:text-primary-700'}`}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className={`px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 ${user ? 'hidden' : ''}`}
                >
                  Sign Up
                </Link>

              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
              {/* Contact Info for Mobile */}
              <div className="px-3 py-2 border-b border-gray-100 mb-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <Phone className="w-4 h-4 text-primary-600" />
                  <span>+91-99500-00669</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <span>Jaipur, Rajasthan</span>
                </div>
              </div>

              {/* Navigation Links */}
              {filteredNavLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive(link.path)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span>{link.name}</span>
                  </Link>
                )
              })}
              
              {/* Auth Section for Mobile */}
              <div className="border-t border-gray-100 pt-2 mt-2">
                {user ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      {user.role === 'admin' && (
                        <p className="text-xs text-primary-600 font-medium">Admin</p>
                      )}
                    </div>
                    {user.role === 'admin' ? (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2 px-3 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <Settings className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-3 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                          <User className="w-5 h-5" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/bookings"
                          className="flex items-center space-x-2 px-3 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                          <Car className="w-5 h-5" />
                          <span>My Bookings</span>
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 px-3">
                    <Link
                      to="/login"
                      className="block w-full text-center px-4 py-2 font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                    
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
