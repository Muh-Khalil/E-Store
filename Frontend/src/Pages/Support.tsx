import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Title from '../Components/Title'
import type { SupportTicket } from '../types'
import LoadingSpinner from '../Components/LoadingSpinner'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { selectToken } from '../store/selectors'
import { backendUrl } from '../config'

const defaultForm = { subject: '', category: 'General', message: '', orderId: '' }

const faqs: { q: string; a: string }[] = [
  { q: 'How can I track my order?', a: 'Open My Orders and use the Track Order button to refresh the latest status.' },
  { q: 'Can I request a return?', a: 'Yes. Open My Orders or submit a Support ticket with the Returns category.' },
  { q: 'How do discount codes work?', a: 'Enter a valid active code in My Cart before checkout.' }
]

const Support = () => {
  const token = useAppSelector(selectToken)
  const navigate = useNavigate()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(true)

  const loadTickets = async () => {
    try {
      if (!token) return navigate('/login')
      const response = await axios.get(`${backendUrl}/api/customer/support`, { headers: { token } })
      if (response.data.success) setTickets(response.data.tickets)
    } finally {
      setLoading(false)
    }
  }

  const submitTicket = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const response = await axios.post(`${backendUrl}/api/customer/support`, form, { headers: { token } })
    if (response.data.success) {
      toast.success(response.data.message)
      setForm(defaultForm)
      loadTickets()
    } else toast.error(response.data.message)
  }

  useEffect(() => { loadTickets() }, [token])

  return (
    <div className='border-t pt-10'>
      <div className='mb-8 rounded-3xl bg-[#FFF8F5] px-6 py-8 sm:px-10'>
        <div className='text-2xl'><Title text1={'SUPPORT'} text2={'CENTER'} /></div>
        <p className='mt-2 max-w-2xl text-sm leading-7 text-gray-600'>Contact support, submit tickets, request help with returns, and view FAQs.</p>
      </div>

      <div className='grid gap-6 lg:grid-cols-[380px_1fr]'>
        <form onSubmit={submitTicket} className='rounded-3xl border border-gray-100 bg-white p-6 shadow-sm'>
          <h2 className='text-lg font-black text-gray-900'>Submit Ticket</h2>
          <div className='mt-4 grid gap-3'>
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required placeholder='Subject' className='rounded-full border border-gray-200 px-5 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className='rounded-full border border-gray-200 px-5 py-3 text-sm outline-none focus:border-[#E8420A]'>
              <option>General</option>
              <option>Order</option>
              <option>Return</option>
              <option>Refund</option>
              <option>Payment</option>
            </select>
            <input value={form.orderId} onChange={(e) => setForm({ ...form, orderId: e.target.value })} placeholder='Order ID optional' className='rounded-full border border-gray-200 px-5 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required placeholder='How can we help?' className='min-h-28 rounded-3xl border border-gray-200 px-5 py-3 text-sm outline-none focus:border-[#E8420A]' />
          </div>
          <button className='mt-4 rounded-full bg-[#E8420A] px-6 py-3 text-sm font-bold text-white'>Send Ticket</button>
        </form>

        {loading ? <LoadingSpinner /> : (
        <div className='grid gap-5'>
          <div className='rounded-3xl border border-gray-100 bg-white p-6 shadow-sm'>
            <h2 className='text-lg font-black text-gray-900'>Your Tickets</h2>
            <div className='mt-4 grid gap-3'>
              {tickets.length === 0 ? <p className='text-sm text-gray-500'>No tickets yet.</p> : tickets.map((ticket) => (
                <div key={ticket._id} className='rounded-2xl bg-gray-50 p-4'>
                  <div className='flex items-center justify-between gap-3'>
                    <p className='font-bold text-gray-900'>{ticket.subject}</p>
                    <span className='rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-700'>{ticket.status}</span>
                  </div>
                  <p className='mt-2 text-sm leading-6 text-gray-600'>{ticket.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='rounded-3xl border border-gray-100 bg-white p-6 shadow-sm'>
            <h2 className='text-lg font-black text-gray-900'>FAQs</h2>
            <div className='mt-4 grid gap-3'>
              {faqs.map((faq) => (
                <div key={faq.q} className='rounded-2xl bg-[#FFF8F5] p-4'>
                  <p className='font-bold text-gray-900'>{faq.q}</p>
                  <p className='mt-1 text-sm leading-6 text-gray-600'>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}

export default Support
