import { memo } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import type { SidebarNavGroup } from '../types'

const navGroups: SidebarNavGroup[] = [
  {
    label: 'Core',
    items: [
      { to: '/products', label: 'Products', icon: assets.add_icon },
      { to: '/add', label: 'Add Product', icon: assets.add_icon },
      { to: '/list', label: 'Product List', icon: assets.order_icon },
      { to: '/orders', label: 'Orders', icon: assets.parcel_icon },
      { to: '/customers', label: 'Customers', iconText: 'CU' },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { to: '/inventory', label: 'Inventory', iconText: 'IN' },
      { to: '/categories', label: 'Categories', iconText: 'CA' },
      { to: '/reviews', label: 'Reviews', iconText: 'RV' },
    ],
  },
  {
    label: 'Growth',
    items: [
      { to: '/promotions', label: 'Promotions', iconText: '%' },
      { to: '/marketing', label: 'Marketing', iconText: 'MK' },
      { to: '/analytics', label: 'Analytics', iconText: 'AN' },
      { to: '/content', label: 'Content', iconText: 'CT' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/shipping', label: 'Shipping', iconText: 'SH' },
      { to: '/payments', label: 'Payments', iconText: 'PY' },
      { to: '/support', label: 'Support', iconText: 'HP' },
      { to: '/staff', label: 'Users & Staff', iconText: 'US' },
      { to: '/settings', label: 'Settings', iconText: 'SE' },
    ],
  },
]

const Sidebar = () => {
  return (
    <aside className='max-h-[calc(100vh-73px)] min-h-[calc(100vh-73px)] w-20 shrink-0 overflow-y-auto border-r border-gray-200 bg-white px-3 py-5 sm:w-72 sm:px-4'>
      <div className='flex flex-col gap-6'>
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className='mb-2 hidden px-3 text-[11px] font-black uppercase tracking-[0.18em] text-gray-400 sm:block'>{group.label}</p>
            <div className='flex flex-col gap-1.5'>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }: { isActive: boolean }) =>
                    `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-[#FFF3EE] text-[#E8420A] shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[11px] font-black shadow-sm ring-1 ring-gray-100'>
                    {item.icon ? <img src={item.icon} alt='' className='h-5 w-5 object-contain' /> : item.iconText}
                  </span>
                  <span className='hidden sm:block'>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default memo(Sidebar)
