import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../config'

const NewsletterBox = () => {
  const [email, setEmail] = useState('')

  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email) { toast.error('Please enter your email'); return }
    try {
      const response = await axios.post(`${backendUrl}/api/customer/newsletter`, { email })
      if (response.data.success) { toast.success('Subscribed successfully!'); setEmail('') }
      else toast.error(response.data.message)
    } catch (err) {
      if (axios.isAxiosError(err)) toast.error(err.response?.data?.message || err.message)
      else toast.error('An unexpected error occurred')
    }
  }

  return (
    <div className='rounded-3xl bg-[#FFF8F5] px-6 py-12 text-center sm:px-10'>
      <p className='text-3xl font-black text-[#1A1A1A]'>Subscribe and get 20% off</p>
      <p className='mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-600'>
        Get special offers, new arrival updates, and private sale alerts in your inbox.
      </p>
      <form onSubmit={onSubmitHandler} className='mx-auto mt-7 flex w-full max-w-xl flex-col gap-3 rounded-2xl bg-white p-2 shadow-sm sm:flex-row'>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder='Enter your email' className='min-h-12 flex-1 rounded-full px-5 outline-none' required />
        <button type='submit' className='rounded-full bg-[#E8420A] px-8 py-4 text-xs font-extrabold text-white transition hover:bg-[#FF6B35]'>SUBSCRIBE</button>
      </form>
    </div>
  )
}

export default NewsletterBox
