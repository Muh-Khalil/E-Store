import { memo, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchAnalytics } from '../store/growthSlice'
import { selectAnalytics, selectGrowthLoading } from '../store/selectors'
import { currency } from '../App'

const Analytics = () => {
  const dispatch = useAppDispatch()
  const data = useAppSelector(selectAnalytics)
  const loading = useAppSelector(selectGrowthLoading)

  useEffect(() => {
    dispatch(fetchAnalytics())
  }, [dispatch])

  const summary = data?.summary || {} as NonNullable<typeof data>['summary']
  const statusRows = Object.entries(data?.statusCounts || {})

  return (
    <section>
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8420A]'>Reports</p>
          <h1 className='mt-2 text-2xl font-black text-gray-900'>Analytics & Reports</h1>
          <p className='mt-1 text-sm text-gray-500'>Monitor revenue, orders, products, customers, and product performance.</p>
        </div>
        <button onClick={() => dispatch(fetchAnalytics())} className='w-fit rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-gray-100'>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className='rounded-3xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500'>Loading analytics...</div>
      ) : (
        <>
          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            <div className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
              <p className='text-xs font-bold uppercase tracking-wide text-gray-500'>Revenue</p>
              <p className='mt-2 text-3xl font-black text-gray-900'>{currency}{Number(summary.revenue || 0).toFixed(2)}</p>
            </div>
            <div className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
              <p className='text-xs font-bold uppercase tracking-wide text-gray-500'>Orders</p>
              <p className='mt-2 text-3xl font-black text-gray-900'>{summary.orders || 0}</p>
            </div>
            <div className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
              <p className='text-xs font-bold uppercase tracking-wide text-gray-500'>Average Order</p>
              <p className='mt-2 text-3xl font-black text-gray-900'>{currency}{Number(summary.averageOrderValue || 0).toFixed(2)}</p>
            </div>
            <div className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
              <p className='text-xs font-bold uppercase tracking-wide text-gray-500'>Conversion</p>
              <p className='mt-2 text-3xl font-black text-gray-900'>{Number(summary.conversionRate || 0).toFixed(1)}%</p>
            </div>
          </div>

          <div className='mt-5 grid gap-5 xl:grid-cols-[1fr_380px]'>
            <div className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
              <h2 className='text-lg font-black text-gray-900'>Top Products</h2>
              <div className='mt-4 grid gap-3'>
                {(data?.topProducts || []).length === 0 ? (
                  <p className='rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500'>No product sales yet.</p>
                ) : data!.topProducts.map((product) => (
                  <div key={product.name} className='grid gap-2 rounded-2xl border border-gray-100 p-4 sm:grid-cols-[1fr_120px_140px] sm:items-center'>
                    <p className='font-bold text-gray-900'>{product.name}</p>
                    <p className='text-sm font-semibold text-gray-600'>{product.quantity} sold</p>
                    <p className='font-black text-gray-900'>{currency}{Number(product.revenue || 0).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
              <h2 className='text-lg font-black text-gray-900'>Store Snapshot</h2>
              <div className='mt-4 grid gap-3 text-sm'>
                <div className='flex justify-between rounded-2xl bg-gray-50 p-4'><span>Paid orders</span><b>{summary.paidOrders || 0}</b></div>
                <div className='flex justify-between rounded-2xl bg-gray-50 p-4'><span>Products</span><b>{summary.products || 0}</b></div>
                <div className='flex justify-between rounded-2xl bg-gray-50 p-4'><span>Customers</span><b>{summary.customers || 0}</b></div>
              </div>
            </aside>
          </div>

          <div className='mt-5 grid gap-5 xl:grid-cols-2'>
            <div className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
              <h2 className='text-lg font-black text-gray-900'>Order Status</h2>
              <div className='mt-4 grid gap-3'>
                {statusRows.length === 0 ? <p className='text-sm text-gray-500'>No order status data.</p> : statusRows.map(([status, count]) => (
                  <div key={status} className='flex items-center justify-between rounded-2xl bg-gray-50 p-4 text-sm'>
                    <span className='font-semibold text-gray-700'>{status}</span>
                    <span className='rounded-full bg-[#FFF3EE] px-3 py-1 text-xs font-bold text-[#E8420A]'>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
              <h2 className='text-lg font-black text-gray-900'>Recent Orders</h2>
              <div className='mt-4 grid gap-3'>
                {(data?.recentOrders || []).length === 0 ? <p className='text-sm text-gray-500'>No recent orders.</p> : data!.recentOrders.map((order) => (
                  <div key={order._id} className='flex items-center justify-between gap-3 rounded-2xl bg-gray-50 p-4 text-sm'>
                    <div>
                      <p className='font-bold text-gray-900'>{currency}{Number(order.amount || 0).toFixed(2)}</p>
                      <p className='mt-1 text-xs text-gray-500'>{order.paymentMethod} &middot; {order.date ? new Date(order.date).toLocaleDateString() : 'No date'}</p>
                    </div>
                    <span className='rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-700 ring-1 ring-gray-100'>{order.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default memo(Analytics)
