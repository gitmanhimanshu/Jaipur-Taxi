import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-50 text-primary-600 mb-6"
        >
          <MapPin className="w-10 h-10" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-bold text-gray-900 mb-3 font-display"
        >
          404 - Page not found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-600 mb-8"
        >
          The page you are looking for might have been moved or deleted.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link to="/" className="inline-flex items-center btn-primary px-6 py-3">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go back home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound



