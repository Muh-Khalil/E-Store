import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useState } from 'react'
import RelatedProduct from '../Components/RelatedProduct'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectProducts, selectCurrency, selectWishlist, selectToken } from '../store/selectors'
import { addToCart as addToCartThunk } from '../store/cartSlice'
import { addToWishlist as addToWishlistThunk, removeFromWishlistInternal } from '../store/customerSlice'
import { toast } from 'react-toastify'

const Product = () => {
  const products = useAppSelector(selectProducts)
  const currency = useAppSelector(selectCurrency)
  const wishlist = useAppSelector(selectWishlist)
  const token = useAppSelector(selectToken)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {productId} = useParams<{ productId: string }>();
  const [productData, setProductData] = useState<import('../types').Product | false>(false)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')

  const fetchProductData = async () => {
    if (!productId) return
    products.map(item => {
      if(item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })
  }

  useEffect(() => {
      fetchProductData();
  },[productId,products])

  const handleAddToCart = (itemId: string, size: string) => {
    if (!size) {
      toast.error('Select Product Size');
      return
    }
    dispatch(addToCartThunk({ itemId, size }))
  }

  const handleAddToWishlist = async (productId: string) => {
    if (!token) {
      navigate('/login')
      return
    }
    try {
      await dispatch(addToWishlistThunk(productId)).unwrap()
      toast.success('Added to wishlist')
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } }).response?.data?.message || (err as Error).message)
    }
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await dispatch(removeFromWishlistInternal(productId)).unwrap()
      toast.success('Removed from wishlist')
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } }).response?.data?.message || (err as Error).message)
    }
  }
   
  return productData ?(
    <div className='border-t pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='grid gap-10 lg:grid-cols-[1.05fr_0.95fr]'>
        <div className='flex flex-col-reverse gap-4 sm:flex-row'>
          <div className='flex w-full justify-between gap-3 overflow-x-auto sm:w-[92px] sm:flex-col sm:justify-normal sm:overflow-y-scroll'> 
          {
            productData.image.map((item, index) => (
             <img src={item} key={index} onClick={() =>setImage(item)} className={`w-[24%] flex-shrink-0 cursor-pointer rounded-2xl border object-cover sm:w-full ${item === image ? 'border-[#E8420A]' : 'border-gray-100'}`} />
            ))
          }
          </div>

          <div className='w-full overflow-hidden rounded-3xl bg-[#FFF8F5] shadow-xl shadow-orange-50'>
            <img src={image} alt="" className='h-full w-full object-cover' />
          </div>

        </div>

        <div className='rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8'>
          <p className='mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#E8420A]'>{productData.category}</p>
          <h1 className='text-3xl font-black text-[#1A1A1A]'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className='w-3 5'/>
            <img src={assets.star_icon} alt="" className='w-3 5'/>
            <img src={assets.star_icon} alt="" className='w-3 5'/>
            <img src={assets.star_icon} alt="" className='w-3 5'/>
            <img src={assets.star_dull_icon} alt="" className='w-3.5'/>
            <p className='pl-2 text-sm text-gray-500'>(122 reviews)</p>
          </div>
          <p className='mt-5 text-4xl font-black text-[#E8420A]'>{currency}{productData.price}</p>
          <p className='mt-5 leading-7 text-gray-500'>{productData.description}</p>
          <div className='flex flex-col gap-2 mt-8'>
            <p className='font-semibold text-gray-800'>Select Size</p>
            <div className='flex flex-wrap gap-2'>
              {
                productData.sizes.map((item,index) => (
                  <button onClick={() => setSize(item)} key={index} className={`cursor-pointer rounded-full border px-5 py-2 text-sm font-semibold transition ${item === size ? 'border-[#E8420A] bg-[#FFF3EE] text-[#E8420A]' : 'border-gray-200 bg-white text-gray-700 hover:border-[#E8420A]'}`} >{item}</button>
                ))
              }
            </div>
          </div>
          <div className='mt-10 flex flex-wrap gap-3'>
            <button onClick={() => handleAddToCart(productData._id, size)} className='w-full rounded-full bg-[#E8420A] px-8 py-4 text-sm font-extrabold text-white shadow-lg shadow-orange-100 transition active:bg-gray-700 hover:bg-[#FF6B35] sm:w-auto'>ADD TO CART</button>
            {(wishlist || []).includes(productData._id) ? (
              <button onClick={() => handleRemoveFromWishlist(productData._id)} className='w-full rounded-full border border-red-100 px-8 py-4 text-sm font-extrabold text-red-600 transition hover:bg-red-50 sm:w-auto'>REMOVE WISHLIST</button>
            ) : (
              <button onClick={() => handleAddToWishlist(productData._id)} className='w-full rounded-full border border-orange-100 px-8 py-4 text-sm font-extrabold text-[#E8420A] transition hover:bg-[#FFF3EE] sm:w-auto'>ADD WISHLIST</button>
            )}
          </div>
          <hr className='mt-8 border-gray-100' />
          <div className='mt-5 flex flex-col gap-2 text-sm text-gray-500'>
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      <div className='mt-20'>
        <div className='flex'>
              <b className='rounded-tl-2xl border border-gray-100 bg-[#FFF8F5] px-5 py-3 text-sm'>Description</b>
              <p className='rounded-tr-2xl border border-gray-100 px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 rounded-b-3xl border border-gray-100 px-6 py-6 text-sm leading-7 text-gray-500'>
            <p>Shop the latest trends, discover exclusive deals, and enjoy a hassle-free shopping experience with secure payments and fast delivery.</p>
            <p>Explore a wide range of products, enjoy great discounts, and shop with confidence with easy returns and reliable customer support.</p>
        </div>
      </div>

       <RelatedProduct category={productData.category} subCategory={productData.subCategory} /> 

    </div>
  ): <div className='min-h-[300px] opacity-0'></div>
}

export default Product
