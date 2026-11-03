import axios from 'axios'
import { useEffect, useState } from 'react'
import Title from '../Components/Title'
import type { Product } from '../types'
import LoadingSpinner from '../Components/LoadingSpinner'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectToken, selectCurrency } from '../store/selectors'
import { addToCart as addToCartThunk } from '../store/cartSlice'
import { removeFromWishlistInternal } from '../store/customerSlice'
import { backendUrl } from '../config'
import { toast } from 'react-toastify'

const Wishlist = () => {
  const token = useAppSelector(selectToken)
  const currency = useAppSelector(selectCurrency)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  const loadWishlist = async () => {
    try {
      if (!token) return navigate('/login')
      const response = await axios.get(`${backendUrl}/api/customer/wishlist`, { headers: { token } })
      if (response.data.success) setProducts(response.data.products)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId: string, size: string) => {
    if (!size) {
      toast.error('Select Product Size')
      return
    }
    await dispatch(addToCartThunk({ itemId: productId, size }))
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await dispatch(removeFromWishlistInternal(productId)).unwrap()
      toast.success('Removed from wishlist')
      loadWishlist()
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } }).response?.data?.message || (err as Error).message)
    }
  }

  useEffect(() => { loadWishlist() }, [token])

  return (
    <div className='border-t pt-10'>
      <div className='mb-8 rounded-3xl bg-[#FFF8F5] px-6 py-8 sm:px-10'>
        <div className='text-2xl'><Title text1={'MY'} text2={'WISHLIST'} /></div>
        <p className='mt-2 max-w-2xl text-sm leading-7 text-gray-600'>Save products for later, remove them, or move them into your cart.</p>
      </div>

      {loading ? <LoadingSpinner /> : products.length === 0 ? (
        <div className='rounded-3xl border border-dashed border-orange-200 bg-white p-10 text-center text-gray-500'>Your wishlist is empty.</div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {products.map((product) => (
            <div key={product._id} className='rounded-3xl border border-gray-100 bg-white p-4 shadow-sm'>
              <img src={imgErrors[product._id] ? '/placeholder.png' : product.image?.[0] || '/placeholder.png'} onError={() => setImgErrors(prev => ({ ...prev, [product._id]: true }))} alt={product.name} className='aspect-[4/5] w-full rounded-2xl bg-[#FFF8F5] object-contain p-3' />
              <p className='mt-3 font-bold text-gray-900'>{product.name}</p>
              <p className='mt-1 text-sm font-bold text-[#E8420A]'>{currency}{product.price}</p>
              <div className='mt-4 flex flex-wrap gap-2'>
                <button onClick={() => handleAddToCart(product._id, product.sizes?.[0])} className='rounded-full bg-[#E8420A] px-4 py-2 text-xs font-bold text-white'>Move to Cart</button>
                <button onClick={() => handleRemoveFromWishlist(product._id)} className='rounded-full border border-red-100 px-4 py-2 text-xs font-bold text-red-600'>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist
