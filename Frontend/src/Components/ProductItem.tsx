import { useState } from 'react'
import { Link } from 'react-router-dom'

interface ProductItemProps {
  id: string;
  image: string[];
  name: string;
  price: number;
  currency?: string;
}

const ProductItem = ({ id, image, name, price, currency = '$' }: ProductItemProps) => {
  const [imgError, setImgError] = useState(false)

  return (
    <Link to={`/product/${id}`} className='group block h-full cursor-pointer'>
      <article className='flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-50'>
        <div className='aspect-[4/5] overflow-hidden bg-[#FFF8F5] p-3 sm:p-4'>
          <img
            src={imgError ? '/placeholder.png' : image?.[0] || '/placeholder.png'}
            onError={() => setImgError(true)}
            alt={name}
            className='h-full w-full object-contain transition duration-500 group-hover:scale-105'
          />
        </div>
        <div className='flex flex-1 flex-col justify-between p-4'>
          <p className='min-h-[40px] text-sm font-semibold leading-5 text-gray-800'>{name}</p>
          <div className='mt-3 flex items-center justify-between gap-3'>
            <p className='text-base font-black text-[#E8420A]'>{currency}{price.toFixed(2)}</p>
            <span className='rounded-full bg-[#FFF3EE] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#E8420A]'>
              View
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default ProductItem
