import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import TaxiServices from './pages/TaxiServices'
import TourPackages from './pages/TourPackages'
import BookingForm from './pages/BookingForm'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import LoadingSpinner from './components/LoadingSpinner'
import NotFound from './pages/NotFound'
import Admin from './pages/Admin'
import AdminServices from './pages/AdminServices'
import AdminTourManagement from './pages/AdminTourManagement'
import AdminTourBookings from './pages/AdminTourBookings'
import AdminTaxiManagement from './pages/AdminTaxiManagement'
import AdminTaxiBookings from './pages/AdminTaxiBookings'
import MyBookings from './pages/MyBookings'
import Profile from './pages/Profile'
import TourDetails from './pages/TourDetails'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/taxi-services" element={<TaxiServices />} />
          <Route path="/tour-packages" element={<TourPackages />} />
          <Route path="/tour/:id" element={<TourDetails />} />
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/tour-management" element={<AdminTourManagement />} />
          <Route path="/admin/tour-bookings" element={<AdminTourBookings />} />
          <Route path="/admin/taxi-management" element={<AdminTaxiManagement />} />
          <Route path="/admin/taxi-bookings" element={<AdminTaxiBookings />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
