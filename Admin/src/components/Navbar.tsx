import { memo } from 'react'
import { assets } from '../assets/assets'
import { useAppDispatch } from '../store/hooks'
import { setAdminToken } from '../store/authSlice'

const Navbar = () => {
  const dispatch = useAppDispatch()

  return (
    <header className='sticky top-0 z-40 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <img src={assets.logo} alt='Admin logo' className='h-12 w-auto cursor-pointer rounded-lg object-contain' />
          <div className='hidden sm:block'>
            <p className='text-sm font-extrabold text-gray-900'>Admin Dashboard</p>
            <p className='text-xs text-gray-500'>Manage products and orders</p>
          </div>
        </div>
        <button onClick={() => dispatch(setAdminToken(null))} className='rounded-full bg-gray-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#E8420A] sm:px-7 sm:text-sm'>Logout</button>
      </div>
    </header>
  )
}

export default memo(Navbar)
