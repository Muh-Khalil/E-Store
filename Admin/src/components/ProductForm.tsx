import { memo, useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import type { ProductFormProps } from '../types'

const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL']

const ProductForm = ({ initialProduct, submitLabel, loading, onSubmit }: ProductFormProps) => {
  const [image1, setImage1] = useState<File | false>(false)
  const [image2, setImage2] = useState<File | false>(false)
  const [image3, setImage3] = useState<File | false>(false)
  const [image4, setImage4] = useState<File | false>(false)
  const [name, setName] = useState(initialProduct?.name || '')
  const [description, setDescription] = useState(initialProduct?.description || '')
  const [price, setPrice] = useState(initialProduct?.price || '')
  const [category, setCategory] = useState(initialProduct?.category || 'Men')
  const [subCategory, setSubCategory] = useState(initialProduct?.subCategory || 'Topwear')
  const [bestSeller, setBestSeller] = useState(Boolean(initialProduct?.bestSeller))
  const [sizes, setSizes] = useState<string[]>(initialProduct?.sizes || [])

  const objectUrlsRef = useRef<Map<number, string>>(new Map())

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      objectUrlsRef.current.clear()
    }
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, setImage: React.Dispatch<React.SetStateAction<File | false>>) => {
    const file = e.target.files?.[0]
    const oldUrl = objectUrlsRef.current.get(index)
    if (oldUrl) URL.revokeObjectURL(oldUrl)
    objectUrlsRef.current.delete(index)

    if (file) {
      const url = URL.createObjectURL(file)
      objectUrlsRef.current.set(index, url)
      setImage(file)
    } else {
      setImage(false)
    }
  }

  const getPreviewUrl = (image: File | false, index: number): string => {
    if (image) {
      return objectUrlsRef.current.get(index) || assets.upload_area
    }
    if (initialProduct?.image?.[index]) return initialProduct.image[index]
    return assets.upload_area
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({
      name,
      description,
      price,
      category,
      subCategory,
      bestSeller,
      sizes,
      images: [image1, image2, image3, image4],
    })
  }

  return (
    <form onSubmit={handleSubmit} className='max-w-5xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
      <div className='mb-6'>
        <p className='mb-3 text-sm font-bold text-gray-800'>Product Images</p>
        <div className='flex flex-wrap gap-3'>
          {[
            [image1, setImage1] as const,
            [image2, setImage2] as const,
            [image3, setImage3] as const,
            [image4, setImage4] as const,
          ].map(([image, setImage], index) => (
            <label key={index} htmlFor={`image${index + 1}`} className='cursor-pointer'>
              <img className='h-24 w-24 rounded-2xl border border-gray-100 bg-[#FFF8F5] object-contain p-2' src={getPreviewUrl(image, index)} alt='' />
              <input onChange={(e) => handleImageChange(e, index, setImage)} type='file' id={`image${index + 1}`} hidden accept='image/*' />
            </label>
          ))}
        </div>
        {initialProduct && <p className='mt-2 text-xs text-gray-500'>Upload new images only if you want to replace existing product images.</p>}
      </div>

      <div className='grid gap-5 md:grid-cols-2'>
        <div className='md:col-span-2'>
          <p className='mb-2 text-sm font-bold text-gray-800'>Product name</p>
          <input onChange={(e) => setName(e.target.value)} value={name} type='text' placeholder='Type here' required className='w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E8420A]' />
        </div>

        <div className='md:col-span-2'>
          <p className='mb-2 text-sm font-bold text-gray-800'>Product description</p>
          <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='min-h-32 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E8420A]' placeholder='Write content here'></textarea>
        </div>

        <div>
          <p className='mb-2 text-sm font-bold text-gray-800'>Product category</p>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className='w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E8420A]'>
            <option value='Men'>Men</option>
            <option value='Women'>Women</option>
            <option value='Kids'>Kids</option>
          </select>
        </div>

        <div>
          <p className='mb-2 text-sm font-bold text-gray-800'>Sub category</p>
          <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className='w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E8420A]'>
            <option value='Topwear'>Topwear</option>
            <option value='Bottomwear'>Bottomwear</option>
            <option value='Winterwear'>Winterwear</option>
          </select>
        </div>

        <div>
          <p className='mb-2 text-sm font-bold text-gray-800'>Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} type='number' placeholder='25' required className='w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E8420A]' />
        </div>

        <div>
          <p className='mb-2 text-sm font-bold text-gray-800'>Product Sizes</p>
          <div className='flex flex-wrap gap-2'>
            {sizeOptions.map((size) => (
              <button type='button' key={size} onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])}
                className={`${sizes.includes(size) ? 'border-[#E8420A] bg-[#FFF3EE] text-[#E8420A]' : 'border-gray-200 bg-white text-gray-600'} rounded-full border px-4 py-2 text-sm font-bold`}>
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='mt-6 flex items-center gap-2'>
        <input onChange={() => setBestSeller(pre => !pre)} checked={bestSeller} type='checkbox' id='bestseller' className='accent-[#E8420A]' />
        <label htmlFor='bestseller' className='cursor-pointer text-sm font-semibold text-gray-700'>Add to bestseller</label>
      </div>

      <button type='submit' disabled={loading}
        className={`mt-6 rounded-full px-8 py-3 text-sm font-bold text-white ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#E8420A] hover:bg-[#FF6B35]'}`}>
        {loading ? 'SAVING...' : submitLabel}
      </button>
    </form>
  )
}

export default memo(ProductForm)
