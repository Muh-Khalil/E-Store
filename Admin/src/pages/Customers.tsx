import { memo, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchCustomers } from '../store/customerSlice'
import { selectCustomers, selectCustomersLoading } from '../store/selectors'
import { currency } from '../App'

const Customers = () => {
  const dispatch = useAppDispatch()
  const customers = useAppSelector(selectCustomers)
  const loading = useAppSelector(selectCustomersLoading)

  useEffect(() => {
    dispatch(fetchCustomers())
  }, [dispatch])

  const totalRevenue = customers.reduce((sum, customer) => sum + Number(customer.lifetimeValue || 0), 0)
  const totalOrders = customers.reduce((sum, customer) => sum + Number(customer.orderCount || 0), 0)

  return (
    <section>
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8420A]'>People</p>
          <h1 className='mt-2 text-2xl font-black text-gray-900'>Customers</h1>
          <p className='mt-1 text-sm text-gray-500'>View customer profiles, order activity, and lifetime value.</p>
        </div>
        <div className='rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-100'>
          {customers.length} customers
        </div>
      </div>

      <div className='mb-5 grid gap-4 sm:grid-cols-3'>
        <div className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
          <p className='text-xs font-bold uppercase tracking-wide text-gray-500'>Customers</p>
          <p className='mt-2 text-3xl font-black text-gray-900'>{customers.length}</p>
        </div>
        <div className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
          <p className='text-xs font-bold uppercase tracking-wide text-gray-500'>Orders</p>
          <p className='mt-2 text-3xl font-black text-gray-900'>{totalOrders}</p>
        </div>
        <div className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
          <p className='text-xs font-bold uppercase tracking-wide text-gray-500'>Lifetime Value</p>
          <p className='mt-2 text-3xl font-black text-gray-900'>{currency}{totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className='overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm'>
        <div className='hidden grid-cols-[minmax(220px,1fr)_220px_120px_150px_160px] items-center gap-4 border-b border-gray-100 bg-gray-50 px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-gray-500 md:grid'>
          <p>Customer</p>
          <p>Email</p>
          <p>Orders</p>
          <p>Lifetime Value</p>
          <p>Last Order</p>
        </div>

        {loading ? (
          <div className='animate-pulse space-y-4 p-5'>
            {[1,2,3].map(i => <div key={i} className='h-16 rounded-2xl bg-gray-200' />)}
          </div>
        ) : customers.length === 0 ? (
          <div className='p-10 text-center text-sm text-gray-500'>No customers found.</div>
        ) : (
          <div className='divide-y divide-gray-100'>
            {customers.map((customer) => (
              <div key={customer._id} className='grid gap-3 px-5 py-4 text-sm transition hover:bg-gray-50/70 md:grid-cols-[minmax(220px,1fr)_220px_120px_150px_160px] md:items-center'>
                <div>
                  <p className='font-bold text-gray-900'>{customer.name || 'Unnamed customer'}</p>
                  <p className='mt-1 text-xs text-gray-500 md:hidden'>{customer.email}</p>
                </div>
                <p className='hidden text-gray-600 md:block'>{customer.email}</p>
                <p><span className='rounded-full bg-[#FFF3EE] px-3 py-1 text-xs font-bold text-[#E8420A]'>{customer.orderCount}</span></p>
                <p className='font-bold text-gray-800'>{currency}{Number(customer.lifetimeValue || 0).toFixed(2)}</p>
                <p className='text-gray-500'>{customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'No orders'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default memo(Customers)
