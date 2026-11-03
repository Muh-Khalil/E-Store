import { memo, useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import { addProduct } from '../store/productSlice'
import { toast } from 'react-toastify'
import ProductForm from '../components/ProductForm'
import type { ProductFormData } from '../types'

const Add = () => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const onSubmitHandler = async (data: ProductFormData) => {
    if (loading) return
    setLoading(true)

    try {
      const formData = new FormData()
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

      const result = await dispatch(addProduct(formData))
      if (addProduct.fulfilled.match(result)) {
        toast.success(result.payload?.message || 'Product added')
        setFormKey(prev => prev + 1)
      } else if (addProduct.rejected.match(result)) {
        toast.error(result.error?.message || 'Failed to add product')
      }
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <div className='mb-6'>
        <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8420A]'>Products</p>
        <h1 className='mt-2 text-2xl font-black text-gray-900'>Add Product</h1>
        <p className='mt-1 text-sm text-gray-500'>Create a new product with images, pricing, variants, and category assignment.</p>
      </div>
      <ProductForm key={formKey} submitLabel='ADD PRODUCT' loading={loading} onSubmit={onSubmitHandler} />
    </section>
  )
}

export default memo(Add)
