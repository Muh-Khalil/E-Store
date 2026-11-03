import { memo, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'
import { useAppSelector } from '../store/hooks'
import { selectAdminToken } from '../store/selectors'
import type { Review, ReviewForm } from '../types'

const defaultForm: ReviewForm = {
  productId: '',
  productName: '',
  customerName: '',
  rating: 5,
  comment: '',
  status: 'Pending',
  response: '',
}

const Reviews = () => {
  const token = useAppSelector(selectAdminToken)
  const [reviews, setReviews] = useState<Review[]>([])
  const [products, setProducts] = useState<Array<{ _id: string; name: string }>>([])
  const [form, setForm] = useState<ReviewForm>(defaultForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${backendUrl}/api/admin-store/reviews`, { headers: { token } })
      if (response.data.success) setReviews(response.data.reviews)
      else toast.error(response.data.message)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || err.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`)
      if (response.data.success) setProducts(response.data.products)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || err.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const selectProduct = (productId: string) => {
    const product = products.find((item) => item._id === productId)
    setForm({ ...form, productId, productName: product?.name || '' })
  }

  const createReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.productId || !form.customerName.trim() || !form.comment.trim()) {
      toast.error('Product, customer, and comment are required')
      return
    }
    try {
      setSaving(true)
      const response = await axios.post(`${backendUrl}/api/admin-store/reviews`, form, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        setForm(defaultForm)
        fetchReviews()
      } else {
        toast.error(response.data.message)
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || err.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setSaving(false)
    }
  }

  const updateReview = async (review: Review, patch: Partial<Review>) => {
    try {
      const response = await axios.put(`${backendUrl}/api/admin-store/reviews/${review._id}`,
        { ...review, ...patch },
        { headers: { token } }
      )
      if (response.data.success) fetchReviews()
      else toast.error(response.data.message)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || err.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const deleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) return
    try {
      const response = await axios.delete(`${backendUrl}/api/admin-store/reviews/${id}`, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchReviews()
      } else {
        toast.error(response.data.message)
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || err.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  useEffect(() => {
    if (!token) return
    fetchReviews()
    fetchProducts()
  }, [token])

  return (
    <section>
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8420A]'>Feedback</p>
          <h1 className='mt-2 text-2xl font-black text-gray-900'>Reviews</h1>
          <p className='mt-1 text-sm text-gray-500'>Create sample feedback, approve reviews, respond, and remove bad entries.</p>
        </div>
        <div className='rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-100'>
          {reviews.length} reviews
        </div>
      </div>

      <div className='grid gap-5 lg:grid-cols-[360px_1fr]'>
        <form onSubmit={createReview} className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
          <h2 className='text-lg font-black text-gray-900'>Add Review</h2>
          <div className='mt-4 grid gap-3'>
            <select value={form.productId} onChange={(e) => selectProduct(e.target.value)} className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]'>
              <option value=''>Select product</option>
              {products.map((product) => <option key={product._id} value={product._id}>{product.name}</option>)}
            </select>
            <input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder='Customer name' className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]'>
              {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} star{rating > 1 ? 's' : ''}</option>)}
            </select>
            <textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder='Review comment' className='min-h-24 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
          </div>
          <button disabled={saving} className='mt-4 rounded-full bg-[#E8420A] px-6 py-3 text-sm font-bold text-white disabled:opacity-60'>{saving ? 'Saving...' : 'Create Review'}</button>
        </form>

        <div className='grid gap-3'>
          {loading ? (
            <div className='animate-pulse space-y-4 p-5'>
              {[1,2,3].map(i => <div key={i} className='h-32 rounded-3xl bg-gray-200' />)}
            </div>
          ) : reviews.length === 0 ? (
            <div className='rounded-3xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500'>No reviews yet.</div>
          ) : reviews.map((review) => (
            <div key={review._id} className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
              <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                <div>
                  <div className='flex flex-wrap items-center gap-2'>
                    <p className='font-black text-gray-900'>{review.productName}</p>
                    <span className='rounded-full bg-[#FFF3EE] px-3 py-1 text-xs font-bold text-[#E8420A]'>{review.rating}/5</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${review.status === 'Approved' ? 'bg-green-50 text-green-700' : review.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-700'}`}>{review.status}</span>
                  </div>
                  <p className='mt-1 text-xs font-semibold text-gray-500'>{review.customerName}</p>
                  <p className='mt-3 text-sm leading-6 text-gray-700'>{review.comment}</p>
                  {review.response && <p className='mt-3 rounded-2xl bg-gray-50 p-3 text-sm leading-6 text-gray-600'>Admin response: {review.response}</p>}
                </div>
                <div className='flex min-w-[190px] flex-col gap-2'>
                  <select value={review.status} onChange={(e) => updateReview(review, { status: e.target.value as Review['status'] })} className='rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700'>
                    <option value='Pending'>Pending</option>
                    <option value='Approved'>Approved</option>
                    <option value='Rejected'>Rejected</option>
                  </select>
                  <input defaultValue={review.response || ''} onBlur={(e) => updateReview(review, { response: e.target.value })} placeholder='Response' className='rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold outline-none focus:border-[#E8420A]' />
                  <button onClick={() => deleteReview(review._id)} className='rounded-full border border-red-100 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50'>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default memo(Reviews)
