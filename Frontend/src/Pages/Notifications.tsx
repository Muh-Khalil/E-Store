import axios from 'axios'
import { useEffect, useState } from 'react'
import Title from '../Components/Title'
import type { Notification } from '../types'
import LoadingSpinner from '../Components/LoadingSpinner'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { selectToken } from '../store/selectors'
import { backendUrl } from '../config'

const Notifications = () => {
  const token = useAppSelector(selectToken)
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const loadNotifications = async () => {
    try {
      if (!token) return navigate('/login')
      const response = await axios.get(`${backendUrl}/api/customer/notifications`, { headers: { token } })
      if (response.data.success) setNotifications(response.data.notifications)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadNotifications() }, [token])

  return (
    <div className='border-t pt-10'>
      <div className='mb-8 rounded-3xl bg-[#FFF8F5] px-6 py-8 sm:px-10'>
        <div className='text-2xl'><Title text1={'MY'} text2={'NOTIFICATIONS'} /></div>
        <p className='mt-2 max-w-2xl text-sm leading-7 text-gray-600'>Order updates, shipping messages, promotions, and account activity.</p>
      </div>

      {loading ? <LoadingSpinner /> : (
      <div className='grid gap-3'>
        {notifications.length === 0 ? (
          <div className='rounded-3xl border border-dashed border-orange-200 bg-white p-10 text-center text-gray-500'>No notifications yet.</div>
        ) : notifications.map((item) => (
          <div key={item.id} className='rounded-3xl border border-gray-100 bg-white p-5 shadow-sm'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='font-black text-gray-900'>{item.title}</p>
                <p className='mt-1 text-sm leading-6 text-gray-600'>{item.message}</p>
              </div>
              <span className='w-fit rounded-full bg-[#FFF3EE] px-3 py-1 text-xs font-bold text-[#E8420A]'>{item.type}</span>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  )
}

export default Notifications
