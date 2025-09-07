import { useEffect, useState } from 'react'
import { authAPI } from '../services/api.js'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [file, setFile] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await authAPI.getProfile()
        if (res.data.success) setUser(res.data.data.user)
      } catch (e) {
        setError('Unable to load profile')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="container-custom py-12 md:py-16">Loading...</div>
  if (error) return <div className="container-custom py-12 md:py-16 text-red-600">{error}</div>
  if (!user) return null

  return (
    <div className="container-custom py-12 md:py-16">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">My Profile</h1>
      <div className="card p-4 md:p-6 max-w-2xl space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <img 
            src={user.profilePicture || '/placeholder-avatar.png'} 
            alt="avatar" 
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border" 
          />
          <div className="flex-1 w-full sm:w-auto">
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            <button 
              disabled={!file || saving} 
              onClick={async () => {
                try {
                  setSaving(true)
                  const form = new FormData()
                  form.append('avatar', file)
                  const res = await fetch('/api/auth/me/avatar', { 
                    method: 'POST', 
                    body: form, 
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
                  })
                  const data = await res.json()
                  if (data.success) {
                    setUser(prev => ({ ...prev, profilePicture: data.data.profilePicture }))
                    // Update localStorage
                    const currentUser = JSON.parse(localStorage.getItem('user'))
                    localStorage.setItem('user', JSON.stringify({
                      ...currentUser,
                      profilePicture: data.data.profilePicture
                    }))
                  }
                } finally { 
                  setSaving(false) 
                }
              }} 
              className="mt-2 px-3 py-1 rounded bg-primary-600 text-white text-sm disabled:opacity-50"
            >
              {saving ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <input 
              className="input-field text-sm md:text-base" 
              value={user.name} 
              onChange={(e)=>setUser({ ...user, name: e.target.value })} 
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Phone</label>
            <input 
              className="input-field text-sm md:text-base" 
              value={user.phone} 
              onChange={(e)=>setUser({ ...user, phone: e.target.value })} 
            />
          </div>
        </div>
        <div className="pt-2">
          <button 
            disabled={saving} 
            onClick={async ()=>{
              try {
                setSaving(true)
                const res = await authAPI.updateProfile({ name: user.name, phone: user.phone })
                if (res.data.success) {
                  const updated = res.data.data.user
                  setUser(updated)
                  localStorage.setItem('user', JSON.stringify(updated))
                }
              } finally { 
                setSaving(false) 
              }
            }} 
            className="px-4 py-2 rounded bg-primary-600 text-white text-sm md:text-base disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
