import { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../Components/Title'
import ProductItem from '../Components/ProductItem'
import LoadingSpinner from '../Components/LoadingSpinner'
import { useAppSelector } from '../store/hooks'
import { selectProducts, selectShowSearch } from '../store/selectors'

const Collections = () => {
  const products = useAppSelector(selectProducts)
  const search = useAppSelector(state => state.products.filters.search)
  const showSearch = useAppSelector(selectShowSearch)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProduct, setFilterProduct] = useState<import('../types').Product[]>([])
  const [category, setCategory] = useState<string[]>([])
  const [subCategory, setSubCategory] = useState<string[]>([])
  const [sortType, setSortType] = useState('relevant')
  const [loading, setLoading] = useState(true)

  const toggleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(category.includes(e.target.value)) {
      setCategory(pre => pre.filter(item => item !== e.target.value))
    }
    else {
      setCategory(pre => [...pre, e.target.value])
    }
  } 

  const toggleSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(subCategory.includes(e.target.value)) {
      setSubCategory(pre => pre.filter(item => item !== e.target.value))
    }
    else {
      setSubCategory(pre => [...pre, e.target.value])
    }
  } 

  const applyFilter = () => {
    let productCopy = products.slice();
    if(showSearch && search) {
      productCopy = productCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase() ))
    }

    if(category.length > 0) {
      productCopy = productCopy.filter((item) => category.includes(item.category))
    }
    if(subCategory.length > 0) {
      productCopy = productCopy.filter((item) => subCategory.includes(item.subCategory))
    }
    setFilterProduct(productCopy)
  }

  useEffect(() => {
    try {
      applyFilter();
    } finally {
      setLoading(false);
    }
  }, [category, subCategory, search, showSearch, products])

  const sortProduct = () => {
    const fpCopy = filterProduct.slice();
    switch(sortType) {
      case 'low-high':
        setFilterProduct(fpCopy.sort((a,b) => (a.price - b.price)))
        break;
      
      case 'high-low':
        setFilterProduct(fpCopy.sort((a,b) => (b.price - a.price)))
        break;

      default:
        applyFilter();
        break;
    }
  }

  useEffect(() => {
    sortProduct();
  },[sortType])

  return (
    <div className='border-t pt-10'>
      <div className='mb-10 rounded-3xl bg-[#FFF8F5] px-6 py-8 sm:px-10'>
        <p className='text-sm font-semibold uppercase tracking-[0.22em] text-[#E8420A]'>Shop the edit</p>
        <h1 className='mt-3 text-3xl font-black text-[#1A1A1A] sm:text-4xl'>All Collections</h1>
        <p className='mt-3 max-w-2xl text-sm leading-7 text-gray-600'>
          Filter by category, sort by price, and find the pieces that fit your wardrobe.
        </p>
      </div>

      <div className='flex flex-col gap-8 sm:flex-row sm:gap-10'>
      
    <aside className='min-w-60'>
      <p onClick={() => setShowFilter(!showFilter)} className='mb-4 flex cursor-pointer items-center gap-2 text-lg font-extrabold text-[#1A1A1A]'>FILTERS
        <img src={assets.dropdown_icon} alt="" className={`h-3 sm:hidden ${showFilter? 'rotate-90' : ''}`}  />
      </p>

      <div className={`rounded-2xl border border-orange-100 bg-white p-5 shadow-sm ${showFilter ? '' : 'hidden'} sm:block`}>
        <p className='mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-gray-500'>Categories</p>
        <div className='flex flex-col gap-3 text-sm text-gray-700'>
          <p className='flex gap-2'>
            <input type="checkbox" value={'Men'} className='w-4 cursor-pointer accent-[#E8420A]' onChange={toggleCategory} /> Men
          </p>
          <p className='flex gap-2'>
            <input type="checkbox" value={'Women'}  className='w-4 cursor-pointer accent-[#E8420A]' onChange={toggleCategory} /> Women
          </p>
          <p className='flex gap-2'>
            <input type="checkbox" value={'Kids'} className='w-4 cursor-pointer accent-[#E8420A]' onChange={toggleCategory} /> Kids
          </p>
        </div>
      </div>

      <div className={`my-5 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm ${showFilter ? '' : 'hidden'} sm:block`}>
        <p className='mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-gray-500'>Type</p>
        <div className='flex flex-col gap-3 text-sm text-gray-700'>
          <p className='flex gap-2'>
            <input type="checkbox" value={'Topwear'} className='w-4 cursor-pointer accent-[#E8420A]' onChange={toggleSubCategory} /> Topwear
          </p>
          <p className='flex gap-2'>
            <input type="checkbox" value={'Bottomwear'}  className='w-4 cursor-pointer accent-[#E8420A]' onChange={toggleSubCategory} /> Bottomwear
          </p>
          <p className='flex gap-2'>
            <input type="checkbox" value={'Winterwear'} className='w-4 cursor-pointer accent-[#E8420A]' onChange={toggleSubCategory} /> Winterwear
          </p>
        </div>
      </div>
    </aside>

    <div className='flex-1'> 
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div className='text-2xl'>
      <Title text1={'ALL'} text2={'COLLECTIONS'} />
      </div>

      <select onChange={(e) => (setSortType(e.target.value))} className='rounded-full border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-[#E8420A]'>
        <option value="relavent">Sort by: Relavent</option>
        <option value="low-high">Sort by: Low to High</option>
        <option value="high-low">Sort by: High to Low</option>
      </select>
      </div>

      {loading ? <LoadingSpinner /> : (
      <div className='grid grid-cols-2 items-stretch gap-4 gap-y-6 sm:gap-5 md:grid-cols-3 lg:grid-cols-4'>
      {
        filterProduct.map((item) => {
          return <ProductItem key={item._id} id={item._id} image={item.image} name={item.name} price={item.price} />
        })
      }
      </div>
      )}
    </div>
    </div>
    </div>
  )
}

export default Collections
