import { memo, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { updateProduct } from '../store/productSlice'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'
import axios from 'axios'
import ProductForm from '../components/ProductForm'
import type { Product, ProductFormData } from '../types'

const EditProduct = () => {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchProduct = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/product/single', { productId })
      if (response.data.success) {
        setProduct(response.data.product)
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

  const onSubmitHandler = async (data: ProductFormData) => {
    if (loading) return
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('id', productId || '')
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('price', String(data.price))
      formData.append('category', data.category)
      formData.append('subCategory', data.subCategory)
      formData.append('bestSeller', String(data.bestSeller))
      formData.append('sizes', JSON.stringify(data.sizes))

      data.images.forEach((image, index) => {
        if (image) formData.append(`image${index + 1}`, image)
      })

      const result = await dispatch(updateProduct(formData))
      if (updateProduct.fulfilled.match(result)) {
        toast.success(result.payload?.message || 'Product updated')
        navigate('/list')
      } else if (updateProduct.rejected.match(result)) {
        toast.error(result.error?.message || 'Failed to update product')
      }
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [productId])

  return (
    <section>
      <div className='mb-6'>
        <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8420A]'>Products</p>
        <h1 className='mt-2 text-2xl font-black text-gray-900'>Edit Product</h1>
        <p className='mt-1 text-sm text-gray-500'>Update product details, set price, manage sizes, and replace images.</p>
      </div>

      {product ? (
        <ProductForm initialProduct={product} submitLabel='UPDATE PRODUCT' loading={loading} onSubmit={onSubmitHandler} />
      ) : (
        <div className='rounded-3xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500'>Loading product...</div>
      )}
    </section>
  )
}

export default memo(EditProduct)
