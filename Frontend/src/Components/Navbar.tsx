import { useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectCartCount, selectToken } from '../store/selectors'
import { setShowSearch } from '../store/productSlice'
import { setToken } from '../store/authSlice'
import { setCartItems, clearDiscount } from '../store/cartSlice'
import { setWishlistItems } from '../store/customerSlice'

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const token = useAppSelector(selectToken)
  const cartCount = useAppSelector(selectCartCount)

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    dispatch(setToken(null))
    dispatch(setCartItems({}))
    dispatch(clearDiscount())
    dispatch(setWishlistItems([]))
  }

  return (
    <div className='relative z-50 flex items-center justify-between bg-white py-5 font-medium'>
      <Link to='/'>
        <img src={assets.logo} alt="" className='w-[80px]'/>
      </Link>
      
      {/* Desktop Navigation Links */}
      <ul className='hidden sm:flex gap-6 text-sm text-gray-700 font-semibold'>
        <NavLink to='/' className='group flex flex-col items-center gap-1 transition duration-300 hover:text-[#E8420A] [&.active]:text-[#E8420A]'>
          <p>Home</p>
          <span className='h-[1.5px] w-0 bg-[#E8420A] transition-all duration-300 group-hover:w-2/4 group-[.active]:w-2/4' />
        </NavLink>
        <NavLink to='/collection' className='group flex flex-col items-center gap-1 transition duration-300 hover:text-[#E8420A] [&.active]:text-[#E8420A]'>
          <p>Collections</p>
          <span className='h-[1.5px] w-0 bg-[#E8420A] transition-all duration-300 group-hover:w-2/4 group-[.active]:w-2/4' />
        </NavLink>
        <NavLink to='/about' className='group flex flex-col items-center gap-1 transition duration-300 hover:text-[#E8420A] [&.active]:text-[#E8420A]'>
          <p>About</p>
          <span className='h-[1.5px] w-0 bg-[#E8420A] transition-all duration-300 group-hover:w-2/4 group-[.active]:w-2/4' />
        </NavLink>
        <NavLink to='/contact' className='group flex flex-col items-center gap-1 transition duration-300 hover:text-[#E8420A] [&.active]:text-[#E8420A]'>
          <p>Contact</p>
          <span className='h-[1.5px] w-0 bg-[#E8420A] transition-all duration-300 group-hover:w-2/4 group-[.active]:w-2/4' />
        </NavLink>
      </ul>

      {/* Right Side Icons */}
      <div className='flex items-center gap-6'>
        <img onClick={() => dispatch(setShowSearch(true))} src={assets.search_icon} alt="" className='w-5 cursor-pointer' />

        <div className='group relative z-50'>
          <img onClick={() => token ? null : navigate('/login')} src={assets.profile_icon} alt="" className='w-5 cursor-pointer' />
          {token &&
            <div className='group-hover:block hidden absolute dropdown-menu right-0 top-full z-[999] pt-4'>
              <div className='flex w-40 flex-col gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-4 text-sm text-gray-600 shadow-xl shadow-black/10'>
                <p onClick={() => navigate('/portal')} className='cursor-pointer rounded-full px-3 py-2 hover:bg-[#FFF3EE] hover:text-[#E8420A]'>My Portal</p>
                <p onClick={() => navigate('/orders')} className='cursor-pointer rounded-full px-3 py-2 hover:bg-[#FFF3EE] hover:text-[#E8420A]'>Orders</p>
                <p onClick={() => navigate('/wishlist')} className='cursor-pointer rounded-full px-3 py-2 hover:bg-[#FFF3EE] hover:text-[#E8420A]'>Wishlist</p>
                <p onClick={logout} className='cursor-pointer rounded-full px-3 py-2 hover:bg-[#FFF3EE] hover:text-[#E8420A]'>Logout</p>
              </div>
            </div>
          }
        </div>

        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} alt="" className='w-5 min-w-5' />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{cartCount}</p>
        </Link>
        
        <img onClick={() => setVisible(true)} src={assets.menu_icon} alt="" className='w-5 cursor-pointer sm:hidden' />
      </div>

      {/* Sidebar menu for small screens */}
      <div className={`fixed inset-y-0 right-0 z-[9999] overflow-hidden bg-white transition-all duration-300 ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-gray-600 h-full'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition duration-200'>
            <img src={assets.dropdown_icon} alt="" className='h-4 rotate-180' />
            <p className='font-bold text-gray-800'>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} to='/' className='py-3 pl-6 border-b border-gray-100 text-sm font-semibold transition hover:bg-[#FFF8F5] hover:text-[#E8420A] [&.active]:bg-[#FFF8F5] [&.active]:text-[#E8420A] [&.active]:border-l-4 [&.active]:border-l-[#E8420A]'>Home</NavLink>
          <NavLink onClick={() => setVisible(false)} to='/collection' className='py-3 pl-6 border-b border-gray-100 text-sm font-semibold transition hover:bg-[#FFF8F5] hover:text-[#E8420A] [&.active]:bg-[#FFF8F5] [&.active]:text-[#E8420A] [&.active]:border-l-4 [&.active]:border-l-[#E8420A]'>Collections</NavLink>
          <NavLink onClick={() => setVisible(false)} to='/about' className='py-3 pl-6 border-b border-gray-100 text-sm font-semibold transition hover:bg-[#FFF8F5] hover:text-[#E8420A] [&.active]:bg-[#FFF8F5] [&.active]:text-[#E8420A] [&.active]:border-l-4 [&.active]:border-l-[#E8420A]'>About</NavLink>
          <NavLink onClick={() => setVisible(false)} to='/contact' className='py-3 pl-6 border-b border-gray-100 text-sm font-semibold transition hover:bg-[#FFF8F5] hover:text-[#E8420A] [&.active]:bg-[#FFF8F5] [&.active]:text-[#E8420A] [&.active]:border-l-4 [&.active]:border-l-[#E8420A]'>Contact</NavLink>
          {token && <NavLink onClick={() => setVisible(false)} to='/portal' className='py-3 pl-6 border-b border-gray-100 text-sm font-semibold transition hover:bg-[#FFF8F5] hover:text-[#E8420A] [&.active]:bg-[#FFF8F5] [&.active]:text-[#E8420A] [&.active]:border-l-4 [&.active]:border-l-[#E8420A]'>My Portal</NavLink>}
          {token && <NavLink onClick={() => setVisible(false)} to='/wishlist' className='py-3 pl-6 border-b border-gray-100 text-sm font-semibold transition hover:bg-[#FFF8F5] hover:text-[#E8420A] [&.active]:bg-[#FFF8F5] [&.active]:text-[#E8420A] [&.active]:border-l-4 [&.active]:border-l-[#E8420A]'>Wishlist</NavLink>}
          {token && <NavLink onClick={() => setVisible(false)} to='/orders' className='py-3 pl-6 border-b border-gray-100 text-sm font-semibold transition hover:bg-[#FFF8F5] hover:text-[#E8420A] [&.active]:bg-[#FFF8F5] [&.active]:text-[#E8420A] [&.active]:border-l-4 [&.active]:border-l-[#E8420A]'>Orders</NavLink>}
        </div>
      </div>
    </div>
  )
}

export default Navbar
