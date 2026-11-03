import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Title from '../Components/Title'
import type { Address, Reward, Notification } from '../types'
import LoadingSpinner from '../Components/LoadingSpinner'
import { useAppSelector } from '../store/hooks'
import { selectToken, selectWishlist, selectCartCount, selectCurrency } from '../store/selectors'
import { backendUrl } from '../config'

const CustomerPortal = () => {
  const token = useAppSelector(selectToken)
  const wishlist = useAppSelector(selectWishlist)
  const getCartCount = useAppSelector(selectCartCount)
  const currency = useAppSelector(selectCurrency)
  const navigate = useNavigate()
  const [profile, setProfile] = useState<{ name: string; email: string; phone?: string; addresses: Address[] } | null>(null)
  const [orders, setOrders] = useState<import('../types').Order[]>([])
  const [rewards, setRewards] = useState<Reward>({ points: 0, referralCredits: 0 })
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const portalCards = [
    {
      title: 'My Account',
      text: 'Profile, password, addresses',
      to: '/account',
      ctaText: 'Manage',
      iconBg: 'bg-indigo-50/70',
      iconColor: 'text-indigo-600',
      hoverBorder: 'hover:border-indigo-200',
      hoverBg: 'hover:bg-indigo-50/10',
      badgeBg: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
      badgeValue: profile ? 'Active' : null,
      svgIcon: (
        <svg className="h-5.5 w-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: 'My Orders',
      text: 'Tracking, invoices, returns',
      to: '/orders',
      ctaText: 'Track Orders',
      iconBg: 'bg-blue-50/70',
      iconColor: 'text-blue-600',
      hoverBorder: 'hover:border-blue-200',
      hoverBg: 'hover:bg-blue-50/10',
      badgeBg: 'bg-blue-50 text-blue-700 border border-blue-100',
      badgeValue: orders.length > 0 ? `${orders.length} Placed` : null,
      svgIcon: (
        <svg className="h-5.5 w-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      )
    },
    {
      title: 'Wishlist',
      text: 'Saved products for later',
      to: '/wishlist',
      ctaText: 'View Items',
      iconBg: 'bg-rose-50/70',
      iconColor: 'text-rose-600',
      hoverBorder: 'hover:border-rose-200',
      hoverBg: 'hover:bg-rose-50/10',
      badgeBg: 'bg-rose-50 text-rose-700 border border-rose-100',
      badgeValue: wishlist.length > 0 ? `${wishlist.length} Items` : null,
      svgIcon: (
        <svg className="h-5.5 w-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      )
    },
    {
      title: 'My Cart',
      text: 'Items, quantities, discounts',
      to: '/cart',
      ctaText: 'Checkout',
      iconBg: 'bg-amber-50/70',
      iconColor: 'text-amber-600',
      hoverBorder: 'hover:border-amber-200',
      hoverBg: 'hover:bg-amber-50/10',
      badgeBg: 'bg-amber-50 text-amber-700 border border-amber-100',
      badgeValue: getCartCount > 0 ? `${getCartCount} Items` : null,
      svgIcon: (
        <svg className="h-5.5 w-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      )
    },
    {
      title: 'Checkout',
      text: 'Shipping and payment',
      to: '/place-order',
      ctaText: 'Pay Now',
      iconBg: 'bg-emerald-50/70',
      iconColor: 'text-emerald-600',
      hoverBorder: 'hover:border-emerald-200',
      hoverBg: 'hover:bg-emerald-50/10',
      badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      badgeValue: getCartCount > 0 ? 'Ready' : null,
      svgIcon: (
        <svg className="h-5.5 w-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      )
    },
    {
      title: 'Notifications',
      text: 'Order and offer updates',
      to: '/notifications',
      ctaText: 'View Updates',
      iconBg: 'bg-yellow-50/70',
      iconColor: 'text-yellow-600',
      hoverBorder: 'hover:border-yellow-200',
      hoverBg: 'hover:bg-yellow-50/10',
      badgeBg: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
      badgeValue: notifications.length > 0 ? `${notifications.length} New` : null,
      svgIcon: (
        <svg className="h-5.5 w-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      )
    },
    {
      title: 'Support',
      text: 'Tickets and FAQs',
      to: '/support',
      ctaText: 'Get Help',
      iconBg: 'bg-teal-50/70',
      iconColor: 'text-teal-600',
      hoverBorder: 'hover:border-teal-200',
      hoverBg: 'hover:bg-teal-50/10',
      badgeBg: 'bg-teal-50 text-teal-700 border border-teal-100',
      badgeValue: '24/7 Live',
      svgIcon: (
        <svg className="h-5.5 w-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096L9 21zm0 0h1.625M9 21H7.375m9.063-5.096L15 21m0 0l-.813-5.096L15 21zm0 0h1.625M15 21h-1.625M9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zM12 21a9.003 9.003 0 008.312-5.513C18.783 15.176 16.98 15 15 15c-1.98 0-3.783.176-5.312.487A9.003 9.003 0 0012 21zm0-9a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
        </svg>
      )
    },
    {
      title: 'Rewards',
      text: 'Points and referrals',
      to: '/rewards',
      ctaText: 'View Points',
      iconBg: 'bg-purple-50/70',
      iconColor: 'text-purple-600',
      hoverBorder: 'hover:border-purple-200',
      hoverBg: 'hover:bg-purple-50/10',
      badgeBg: 'bg-purple-50 text-purple-700 border border-purple-100',
      badgeValue: rewards.points > 0 ? `${rewards.points} Pts` : null,
      svgIcon: (
        <svg className="h-5.5 w-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      )
    }
  ]

  if (!token) {
    navigate('/login')
    return null
  }

  const loadDashboard = async () => {
    try {
      const [profileRes, ordersRes, rewardsRes, notificationsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/customer/profile`, { headers: { token } }),
        axios.post(`${backendUrl}/api/order/userorders`, {}, { headers: { token } }),
        axios.get(`${backendUrl}/api/customer/rewards`, { headers: { token } }),
        axios.get(`${backendUrl}/api/customer/notifications`, { headers: { token } })
      ])

      if (profileRes.data.success) setProfile(profileRes.data.user)
      if (ordersRes.data.success) setOrders(ordersRes.data.orders || [])
      if (rewardsRes.data.success) setRewards(rewardsRes.data.rewards)
      if (notificationsRes.data.success) setNotifications(notificationsRes.data.notifications || [])
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [token])

  if (loading) return <LoadingSpinner />

  const latestOrder = [...orders].sort((a, b) => Number(b.date || 0) - Number(a.date || 0))[0]
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0)
  const defaultAddress = (profile?.addresses || []).find((item) => item.isDefault) || profile?.addresses?.[0]

  return (
    <div className='border-t pt-10'>
      <div className='mb-6 overflow-hidden rounded-3xl bg-[#1A1A1A] text-white'>
        <div className='grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_320px] lg:items-center'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#FFB199]'>Customer Dashboard</p>
            <h1 className='mt-3 text-3xl font-black sm:text-4xl'>Welcome{profile?.name ? `, ${profile.name}` : ''}</h1>
            <p className='mt-3 max-w-2xl text-sm leading-7 text-white/70'>
              Manage orders, saved products, addresses, rewards, support, and checkout activity from one focused workspace.
            </p>
          </div>
          <div className='p-5'>
            <p className='text-xs font-bold uppercase tracking-wide text-white/60'>Latest Order</p>
            <p className='mt-2 text-2xl font-black'>{latestOrder ? latestOrder.status : 'No orders yet'}</p>
            <p className='mt-2 text-sm text-white/65'>{latestOrder ? `${currency}${latestOrder.amount} · ${new Date(latestOrder.date).toDateString()}` : 'Start shopping to see tracking here.'}</p>
            <Link to='/orders' className='mt-4 inline-flex rounded-full bg-[#E8420A] px-5 py-2.5 text-sm font-bold text-white'>View Orders</Link>
          </div>
        </div>
      </div>

      <div className='mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-3xl border border-gray-100 bg-white p-5 shadow-sm'>
          <p className='text-xs font-bold uppercase tracking-wide text-gray-500'>Orders</p>
          <p className='mt-2 text-3xl font-black text-gray-900'>{orders.length}</p>
          <p className='mt-1 text-sm text-gray-500'>{currency}{totalSpent.toFixed(2)} spent</p>
        </div>
        <div className='rounded-3xl border border-gray-100 bg-white p-5 shadow-sm'>
          <p className='text-xs font-bold uppercase tracking-wide text-gray-500'>Cart Items</p>
          <p className='mt-2 text-3xl font-black text-gray-900'>{getCartCount}</p>
          <p className='mt-1 text-sm text-gray-500'>Ready for checkout</p>
        </div>
        <div className='rounded-3xl border border-gray-100 bg-white p-5 shadow-sm'>
          <p className='text-xs font-bold uppercase tracking-wide text-gray-500'>Wishlist</p>
          <p className='mt-2 text-3xl font-black text-gray-900'>{wishlist.length}</p>
          <p className='mt-1 text-sm text-gray-500'>Saved products</p>
        </div>
        <div className='rounded-3xl border border-gray-100 bg-white p-5 shadow-sm'>
          <p className='text-xs font-bold uppercase tracking-wide text-gray-500'>Rewards</p>
          <p className='mt-2 text-3xl font-black text-gray-900'>{rewards.points || 0}</p>
          <p className='mt-1 text-sm text-gray-500'>{currency}{rewards.referralCredits || 0} referral credit</p>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-[1fr_340px]'>
        <div className='p-5 sm:p-6'>
          <div className='mb-5 flex items-end justify-between gap-4'>
            <div>
              <div className='text-xl'><Title text1={'QUICK'} text2={'ACTIONS'} /></div>
              <p className='mt-1 text-sm text-gray-500'>Open the customer tools you use most often.</p>
            </div>
          </div>

          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            {portalCards.map((card) => (
              <Link 
                key={card.title} 
                to={card.to} 
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${card.hoverBorder} ${card.hoverBg}`}
              >
                <div>
                  <div className='flex items-center justify-between gap-4'>
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${card.iconBg} ${card.iconColor} shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      {card.svgIcon}
                    </span>
                    {card.badgeValue && (
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${card.badgeBg} shadow-sm transition-transform duration-300 group-hover:scale-105`}>
                        {card.badgeValue}
                      </span>
                    )}
                  </div>
                  <div className='mt-4'>
                    <h3 className='font-black tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-gray-950'>{card.title}</h3>
                    <p className='mt-1 text-xs leading-relaxed text-gray-500 line-clamp-2'>{card.text}</p>
                  </div>
                </div>
                <div className='mt-5 flex items-center justify-between border-t border-gray-100/60 pt-3'>
                  <span className={`text-[10px] font-black uppercase tracking-wider ${card.iconColor} transition-all duration-300 group-hover:translate-x-0.5`}>
                    {card.ctaText}
                  </span>
                  <svg 
                    className={`h-4 w-4 ${card.iconColor} transition-transform duration-300 group-hover:translate-x-1`} 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <aside className='grid gap-4'>
          <div className='rounded-3xl border border-gray-100 bg-white p-5 shadow-sm'>
            <p className='text-xs font-bold uppercase tracking-wide text-gray-500'>Default Address</p>
            {defaultAddress ? (
              <div className='mt-3 text-sm leading-6 text-gray-600'>
                <p className='font-black text-gray-900'>{defaultAddress.firstName} {defaultAddress.lastName}</p>
                <p>{defaultAddress.street}, {defaultAddress.city}</p>
                <p>{defaultAddress.state}, {defaultAddress.country} {defaultAddress.zipcode}</p>
              </div>
            ) : (
              <p className='mt-3 text-sm leading-6 text-gray-500'>No saved address yet.</p>
            )}
            <Link to='/account' className='mt-4 inline-flex rounded-full border border-orange-100 px-4 py-2 text-xs font-bold text-[#E8420A]'>Manage Address</Link>
          </div>

          <div className='rounded-3xl border border-gray-100 bg-white p-5 shadow-sm'>
            <p className='text-xs font-bold uppercase tracking-wide text-gray-500'>Recent Updates</p>
            <div className='mt-3 grid gap-3'>
              {notifications.slice(0, 3).length === 0 ? (
                <p className='text-sm text-gray-500'>No updates yet.</p>
              ) : notifications.slice(0, 3).map((item) => (
                <div key={item.id} className='rounded-2xl bg-gray-50 p-3'>
                  <p className='text-sm font-bold text-gray-900'>{item.title}</p>
                  <p className='mt-1 line-clamp-2 text-xs leading-5 text-gray-500'>{item.message}</p>
                </div>
              ))}
            </div>
            <Link to='/notifications' className='mt-4 inline-flex rounded-full border border-orange-100 px-4 py-2 text-xs font-bold text-[#E8420A]'>View All</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CustomerPortal
