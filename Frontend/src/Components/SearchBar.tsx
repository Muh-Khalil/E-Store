import { assets } from '../assets/assets'
import { useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setSearch, setShowSearch } from '../store/productSlice'
import { selectShowSearch } from '../store/selectors'

const SearchBar = () => {
  const dispatch = useAppDispatch()
  const search = useAppSelector(state => state.products.filters.search)
  const showSearch = useAppSelector(selectShowSearch)
  const location = useLocation()
  const visible = location.pathname.includes('collection')

  return showSearch && visible ? (
    <div className='border-t border-b bg-gray-50 text-center'>
      <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
        <input value={search} onChange={(e) => dispatch(setSearch(e.target.value))} type="text" placeholder='Search' className='flex-1 outline-none bg-inherit text-sm' />
        <img src={assets.search_icon} alt="" className='w-4 cursor-pointer' />
      </div>
      <img onClick={() => dispatch(setShowSearch(false))} src={assets.cross_icon} alt="" className='inline w-3 cursor-pointer hover:drop-shadow-2xl' />
    </div>
  ) : null
}

export default SearchBar
