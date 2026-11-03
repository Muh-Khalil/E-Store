import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Title from '../Components/Title'
import type { Address } from '../types'
import LoadingSpinner from '../Components/LoadingSpinner'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { selectToken } from '../store/selectors'
import { backendUrl } from '../config'

const emptyAddress: Address = { firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: '', phone: '', isDefault: false }

const Account = () => {
  const token = useAppSelector(selectToken)
  const navigate = useNavigate()
  const [profile, setProfile] = useState<{ name: string; email: string; phone: string; addresses: Address[] }>({ name: '', email: '', phone: '', addresses: [] })
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' })
  const [address, setAddress] = useState<Address>(emptyAddress)
  const [loading, setLoading] = useState(true)

  const loadProfile = async () => {
    try {
      if (!token) return navigate('/login')
      const response = await axios.get(`${backendUrl}/api/customer/profile`, { headers: { token } })
      if (response.data.success) setProfile(response.data.user)
      else toast.error(response.data.message)
    }
    catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } }).response?.data?.message || (err as Error).message)
    }
    finally {
      setLoading(false)
    }
  }

  const updateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const response = await axios.put(`${backendUrl}/api/customer/profile`, profile, { headers: { token } })
    if (response.data.success) {
      toast.success(response.data.message)
      setProfile(response.data.user)
    } else toast.error(response.data.message)
  }

  const changePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const response = await axios.put(`${backendUrl}/api/customer/password`, password, { headers: { token } })
    if (response.data.success) {
      toast.success(response.data.message)
      setPassword({ currentPassword: '', newPassword: '' })
    } else toast.error(response.data.message)
  }

  const saveAddress = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const response = await axios.post(`${backendUrl}/api/customer/addresses`, { address }, { headers: { token } })
    if (response.data.success) {
      toast.success(response.data.message)
      setProfile({ ...profile, addresses: response.data.addresses })
      setAddress(emptyAddress)
    } else toast.error(response.data.message)
  }

  const deleteAddress = async (id: string) => {
    const response = await axios.delete(`${backendUrl}/api/customer/addresses/${id}`, { headers: { token } })
    if (response.data.success) setProfile({ ...profile, addresses: response.data.addresses })
    else toast.error(response.data.message)
  }

  const setDefaultAddress = async (id: string) => {
    const response = await axios.put(`${backendUrl}/api/customer/addresses/${id}/default`, {}, { headers: { token } })
    if (response.data.success) setProfile({ ...profile, addresses: response.data.addresses })
    else toast.error(response.data.message)
  }

  useEffect(() => { loadProfile() }, [token])

  if (loading) return <LoadingSpinner />

  const inputClass = 'rounded-full border border-gray-200 px-5 py-3 text-sm outline-none focus:border-[#E8420A]'

  return (
    <div className='border-t pt-10'>
      <div className='mb-8 rounded-3xl bg-[#FFF8F5] px-6 py-8 sm:px-10'>
        <div className='text-2xl'><Title text1={'MY'} text2={'ACCOUNT'} /></div>
        <p className='mt-2 max-w-2xl text-sm leading-7 text-gray-600'>Update your profile, password, and delivery addresses.</p>
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <form onSubmit={updateProfile} className='rounded-3xl border border-gray-100 bg-white p-6 shadow-sm'>
          <h2 className='text-lg font-black text-gray-900'>Profile Details</h2>
          <div className='mt-4 grid gap-3'>
            <input value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={inputClass} placeholder='Name' />
            <input value={profile.email || ''} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={inputClass} placeholder='Email' />
            <input value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={inputClass} placeholder='Phone' />
          </div>
          <button className='mt-4 rounded-full bg-[#E8420A] px-6 py-3 text-sm font-bold text-white'>Save Profile</button>
        </form>

        <form onSubmit={changePassword} className='rounded-3xl border border-gray-100 bg-white p-6 shadow-sm'>
          <h2 className='text-lg font-black text-gray-900'>Change Password</h2>
          <div className='mt-4 grid gap-3'>
            <input type='password' value={password.currentPassword} onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })} className={inputClass} placeholder='Current password' />
            <input type='password' value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} className={inputClass} placeholder='New password' />
          </div>
          <button className='mt-4 rounded-full bg-[#E8420A] px-6 py-3 text-sm font-bold text-white'>Update Password</button>
        </form>
      </div>

      <div className='mt-6 grid gap-6 lg:grid-cols-[380px_1fr]'>
        <form onSubmit={saveAddress} className='rounded-3xl border border-gray-100 bg-white p-6 shadow-sm'>
          <h2 className='text-lg font-black text-gray-900'>Add Address</h2>
          <div className='mt-4 grid gap-3'>
            {['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipcode', 'country', 'phone'].map((field) => (
              <input key={field} value={(address as unknown as Record<string, string>)[field] || ''} onChange={(e) => setAddress({ ...address, [field]: e.target.value })} className={inputClass} placeholder={field.replace(/([A-Z])/g, ' $1')} />
            ))}
            <label className='flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700'>
              <input type='checkbox' checked={address.isDefault || false} onChange={(e) => setAddress({ ...address, isDefault: e.target.checked })} />
              Default address
            </label>
          </div>
          <button className='mt-4 rounded-full bg-[#E8420A] px-6 py-3 text-sm font-bold text-white'>Save Address</button>
        </form>

        <div className='grid gap-3'>
          {(profile.addresses || []).length === 0 ? (
            <div className='rounded-3xl border border-dashed border-orange-200 bg-white p-10 text-center text-gray-500'>No saved addresses.</div>
          ) : profile.addresses.map((item) => (
            <div key={item.id} className='rounded-3xl border border-gray-100 bg-white p-5 shadow-sm'>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                <div>
                  <p className='font-black text-gray-900'>{item.firstName} {item.lastName} {item.isDefault && <span className='ml-2 rounded-full bg-[#FFF3EE] px-3 py-1 text-xs text-[#E8420A]'>Default</span>}</p>
                  <p className='mt-2 text-sm leading-6 text-gray-600'>{item.street}, {item.city}, {item.state}, {item.country} {item.zipcode}</p>
                  <p className='text-sm text-gray-500'>{item.email} · {item.phone}</p>
                </div>
                <div className='flex gap-2'>
                  <button onClick={() => setDefaultAddress(item.id!)} className='rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700'>Default</button>
                  <button onClick={() => deleteAddress(item.id!)} className='rounded-full border border-red-100 px-4 py-2 text-xs font-bold text-red-600'>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Account
